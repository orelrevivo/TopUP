import { NextRequest, NextResponse } from "next/server";
import { getUserId } from '~/lib/auth';
import { db } from '~/lib/db';
import { users } from '~/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { createDataStream, streamText, convertToCoreMessages, type Message } from 'ai';
import { createScopedLogger } from '~/utils/logger';
import type { IProviderSetting } from '~/types/model';
import { DEFAULT_MODEL, DEFAULT_PROVIDER, MODEL_REGEX, PROVIDER_REGEX, PROVIDER_LIST } from '~/utils/constants';
import { LLMManager } from '~/lib/modules/llm/manager';
import type { ProgressAnnotation } from '~/types/context';
import { getHackingSystemPrompt } from '~/lib/common/prompts/hacking-prompts';


export async function POST(request: Request) {
  return hackingChatAction(request);
}

const logger = createScopedLogger('api.hacking-chat');

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  const items = cookieHeader.split(';').map((c) => c.trim());
  items.forEach((item) => {
    const [name, ...rest] = item.split('=');
    if (name && rest) {
      cookies[decodeURIComponent(name.trim())] = decodeURIComponent(rest.join('=').trim());
    }
  });
  return cookies;
}

function extractModelProvider(messages: Message[]): { model: string; provider: string } {
  // Read model/provider from the last user message header (same pattern as main chat)
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role !== 'user') continue;
    const text = Array.isArray(msg.content)
      ? (msg.content.find((p: any) => p.type === 'text') as any)?.text || ''
      : msg.content || '';
    const modelMatch = text.match(MODEL_REGEX);
    const providerMatch = text.match(PROVIDER_REGEX);
    if (modelMatch || providerMatch) {
      return {
        model: modelMatch ? modelMatch[1] : DEFAULT_MODEL,
        provider: providerMatch ? providerMatch[1] : DEFAULT_PROVIDER.name,
      };
    }
  }
  return { model: DEFAULT_MODEL, provider: DEFAULT_PROVIDER.name };
}

function stripPrefixFromMessages(messages: Message[]): Message[] {
  // Remove [Model: ...] and [Provider: ...] headers from user messages before sending to AI
  return messages.map((msg): Message => {
    if (msg.role !== 'user') return msg;
    const stripHeaders = (text: string) =>
      text.replace(MODEL_REGEX, '').replace(PROVIDER_REGEX, '').trim();

    if (Array.isArray(msg.content)) {
      return {
        ...msg,
        content: msg.content.map((part: any) =>
          part.type === 'text' ? { ...part, text: stripHeaders(part.text || '') } : part
        ) as any,
      } as Message;
    }
    return { ...msg, content: stripHeaders(msg.content as string) } as Message;
  });
}

async function hackingChatAction(request: Request) {
  const userId = await getUserId(request as unknown as NextRequest);
  if (!userId) {
    return new Response(JSON.stringify({ error: true, message: 'Unauthorized. Please log in.' }), { status: 401 });
  }

  // Check balance
  const userRows = await db.select({ balance: users.balance }).from(users).where(eq(users.id, userId));
  if (userRows.length === 0 || userRows[0].balance < 5) {
    return new Response(
      JSON.stringify({ error: true, message: 'Insufficient credits. Please top up your balance.' }),
      { status: 402 }
    );
  }

  const { messages } = (await request.json()) as { messages: Message[] };

  const cleanMessages = stripPrefixFromMessages(messages);

  const cumulativeUsage = { completionTokens: 0, promptTokens: 0, totalTokens: 0 };
  const liveDeductionState = { deductedCents: 0 };
  const encoder = new TextEncoder();
  let progressCounter = 1;
  let lastChunk: string | undefined;

  // ─── SYSTEM PROMPT ────────────────────────────────────────────────────────
  const HACKING_SYSTEM_PROMPT = getHackingSystemPrompt();
  // ──────────────────────────────────────────────────────────────────────────

  const dataStream = createDataStream({
    async execute(dataStream) {
      dataStream.writeData({
        type: 'progress',
        label: 'response',
        status: 'in-progress',
        order: progressCounter++,
        message: 'Generating Response',
      } satisfies ProgressAnnotation);

      try {
        const history = cleanMessages.slice(0, -1).map((m: any) => ({
          role: m.role,
          content: m.content
        }));

        const response = await fetch('http://127.0.0.1:8000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: cleanMessages[cleanMessages.length - 1].content,
            history: history
          })
        });

        if (!response.ok) {
          throw new Error(`Bridge returned status ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) {
              // Format chunk according to Vercel AI SDK protocol for text
              dataStream.write(`0:${JSON.stringify(chunk)}\n` as any);
            }
          }
        }
      } catch (err: any) {
        logger.error('Error connecting to local bridge:', err);
        dataStream.write(`0:${JSON.stringify(`\n\n[Error communicating with local AI bridge: ${err.message}]`)}\n` as any);
      }

      dataStream.writeData({
        type: 'progress',
        label: 'response',
        status: 'complete',
        order: progressCounter++,
        message: 'Response Generated',
      } satisfies ProgressAnnotation);

      // Cleaned up chars deduction loop since local models do not deduct balance
    },
    onError: (error: any) => `Custom error: ${error.message || 'Unknown error'}`,
  }).pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        if (!lastChunk) lastChunk = ' ';
        lastChunk = chunk;
        const str = typeof chunk === 'string' ? chunk : JSON.stringify(chunk);
        controller.enqueue(encoder.encode(str));
      },
    }),
  );

  return new Response(dataStream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Text-Encoding': 'chunked',
    },
  });
}
