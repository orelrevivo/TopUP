import { NextRequest, NextResponse } from "next/server";
const json = NextResponse.json;

import { getUserId } from '~/lib/auth';
import { db } from '~/lib/db';
import { users } from '~/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { createDataStream, generateId } from 'ai';
import { type FileMap } from '~/lib/.server/llm/constants';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';
import type { IProviderSetting } from '~/types/model';
import { createScopedLogger } from '~/utils/logger';
import { getFilePaths, selectContext } from '~/lib/.server/llm/select-context';
import type { ContextAnnotation, ProgressAnnotation } from '~/types/context';
import { WORK_DIR } from '~/utils/constants';
import { createSummary } from '~/lib/.server/llm/create-summary';
import { extractPropertiesFromMessage } from '~/lib/.server/llm/utils';
import type { DesignScheme } from '~/types/design-scheme';
import { MCPService } from '~/lib/services/mcpService';
import { StreamRecoveryManager } from '~/lib/.server/llm/stream-recovery';
import { SupabaseService } from '~/lib/services/supabaseService';
import type { RouteArgs } from '~/lib/security';

export async function POST(request: Request) {
  return chatAction({ request, context: { cloudflare: { env: process.env as Record<string, string> } } });
}

const logger = createScopedLogger('api.chat');

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  const items = cookieHeader.split(';').map((cookie) => cookie.trim());

  items.forEach((item) => {
    const [name, ...rest] = item.split('=');

    if (name && rest) {
      const decodedName = decodeURIComponent(name.trim());
      const decodedValue = decodeURIComponent(rest.join('=').trim());
      cookies[decodedName] = decodedValue;
    }
  });

  return cookies;
}

async function chatAction({ context, request }: RouteArgs) {
  const userId = await getUserId(request as unknown as NextRequest);
  if (!userId) {
    return new Response(JSON.stringify({ error: true, message: 'Unauthorized. Please log in.' }), { status: 401 });
  }

  // Check balance
  const userRows = await db.select({ balance: users.balance }).from(users).where(eq(users.id, userId));
  if (userRows.length === 0 || userRows[0].balance < 5) {
    return new Response(JSON.stringify({ error: true, message: 'Insufficient credits. Please top up your balance.' }), { status: 402 });
  }

  const streamRecovery = new StreamRecoveryManager({
    timeout: 45000,
    maxRetries: 2,
    onTimeout: () => {
      logger.warn('Stream timeout - attempting recovery');
    },
  });

  const { messages, files, promptId, contextOptimization, supabase, chatMode, designScheme, maxLLMSteps, mcpEnabled, chatId } =
    (await request.json()) as {
      messages: Messages;
      files: any;
      promptId?: string;
      contextOptimization: boolean;
      chatMode: 'discuss' | 'build';
      designScheme?: DesignScheme;
      supabase?: {
        isConnected: boolean;
        hasSelectedProject: boolean;
        credentials?: {
          anonKey?: string;
          supabaseUrl?: string;
        };
      };
      maxLLMSteps: number;
      mcpEnabled?: boolean;
      chatId?: string;
    };

  const cookieHeader = request.headers.get('Cookie');
  const apiKeys = JSON.parse(parseCookies(cookieHeader || '').apiKeys || '{}');
  const providerSettings: Record<string, IProviderSetting> = JSON.parse(
    parseCookies(cookieHeader || '').providers || '{}',
  );

  const stream = new SwitchableStream();

  const cumulativeUsage = {
    completionTokens: 0,
    promptTokens: 0,
    totalTokens: 0,
  };
  const encoder: TextEncoder = new TextEncoder();
  let progressCounter: number = 1;

  try {
    const mcpService = mcpEnabled ? MCPService.getInstance() : null;
    const totalMessageContent = messages.reduce((acc, message) => acc + message.content, '');
    logger.debug(`Total message length: ${totalMessageContent.split(' ').length}, words`);

    let lastChunk: string | undefined = undefined;

    const dataStream = createDataStream({
      async execute(dataStream) {
        streamRecovery.startMonitoring();

        const filePaths = getFilePaths(files || {});
        let filteredFiles: FileMap | undefined = undefined;
        let summary: string | undefined = undefined;
        let messageSliceId = 0;

        const processedMessages = mcpService ? await mcpService.processToolInvocations(messages, dataStream) : messages as Messages;

        let cloneUrlMatch = null;
        const lastMessage = processedMessages[processedMessages.length - 1];
        if (lastMessage && lastMessage.role === 'user' && typeof lastMessage.content === 'string') {
          const match = lastMessage.content.match(/\[Clone Website:\s*([^\]]+)\]/);
          if (match) {
            cloneUrlMatch = match[1].trim();
            const finalUrl = cloneUrlMatch.startsWith('http') ? cloneUrlMatch : `https://${cloneUrlMatch}`;
            const domain = new URL(finalUrl).hostname;

            dataStream.writeData({
              type: 'progress',
              label: 'scraping',
              status: 'in-progress',
              order: progressCounter++,
              message: `Launching visual agent on ${domain}...`,
            } satisfies ProgressAnnotation);

            try {
              // ─── STEP 1: Parallel fetch — full-page screenshot + content ─────────────
              // thum.io renders full JS pages and returns a real screenshot image
              const screenshotServiceUrl = `https://image.thum.io/get/width/1440/crop/900/noanimate/${finalUrl}`;

              const [screenshotResponse, jinaResponse] = await Promise.all([
                fetch(screenshotServiceUrl).catch(() => null),
                fetch(`https://r.jina.ai/${finalUrl}`, {
                  headers: { 'Accept': 'application/json', 'X-Return-Format': 'markdown' }
                }).catch(() => null),
              ]);

              dataStream.writeData({
                type: 'progress',
                label: 'scraping',
                status: 'in-progress',
                order: progressCounter++,
                message: 'Capturing high-resolution viewport screenshot...',
              } satisfies ProgressAnnotation);

              // ─── STEP 2: Convert screenshot to base64 so the AI can actually SEE it ──
              let screenshotBase64: string | null = null;
              let screenshotMimeType = 'image/jpeg';
              if (screenshotResponse && screenshotResponse.ok) {
                const contentType = screenshotResponse.headers.get('content-type') || 'image/jpeg';
                screenshotMimeType = contentType.split(';')[0].trim();
                const arrayBuffer = await screenshotResponse.arrayBuffer();
                const bytes = new Uint8Array(arrayBuffer);
                let binary = '';
                bytes.forEach(b => { binary += String.fromCharCode(b); });
                screenshotBase64 = btoa(binary);
              }

              dataStream.writeData({
                type: 'progress',
                label: 'scraping',
                status: 'in-progress',
                order: progressCounter++,
                message: 'Extracting text content, images, and links...',
              } satisfies ProgressAnnotation);

              // ─── STEP 3: Parse Jina content (clean markdown with image URLs) ─────────
              let scrapedMarkdown = '';
              if (jinaResponse && jinaResponse.ok) {
                try {
                  const jinaJson = await jinaResponse.json();
                  scrapedMarkdown = jinaJson.data?.content || '';
                } catch {
                  scrapedMarkdown = await jinaResponse.text().catch(() => '');
                }
              }

              // ─── STEP 4: Extract all image URLs from the Jina markdown ────────────
              // Jina already converts all images to clean markdown ![alt](url) format
              const mdImageMatches = [...scrapedMarkdown.matchAll(/!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g)];
              const extractedImages = mdImageMatches.map(m => ({ alt: m[1], url: m[2] }));
              
              // Also catch raw URLs that look like images
              const rawImageMatches = [...scrapedMarkdown.matchAll(/https?:\/\/[^\s"'<>)]+\.(?:png|jpg|jpeg|gif|webp|svg|ico)(?:\?[^\s"'<>)]*)?/gi)];
              rawImageMatches.forEach(m => {
                if (!extractedImages.some(img => img.url === m[0])) {
                  extractedImages.push({ alt: '', url: m[0] });
                }
              });

              dataStream.writeData({
                type: 'progress',
                label: 'scraping',
                status: 'in-progress',
                order: progressCounter++,
                message: `Found ${extractedImages.length} image assets. Handing to vision AI...`,
              } satisfies ProgressAnnotation);

              // ─── STEP 5: Build the ultra-rich clone instruction ────────────────────
              const imageInventory = extractedImages.length > 0
                ? extractedImages.map((img, i) => `  ${i + 1}. ${img.alt ? `"${img.alt}" → ` : ''}${img.url}`).join('\n')
                : '  (None found — extract visually from the screenshot)';

              const cloneInstruction = `[CLONE WEBSITE TASK]

Target URL: ${finalUrl}
Domain: ${domain}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👁️ VISION INPUT: You have been given a HIGH-RESOLUTION SCREENSHOT of the actual rendered website as an image attachment. This is a real pixel-perfect capture of the live site. USE IT to extract:
  • Exact background colors, text colors, accent/brand colors
  • Font sizes, font weights, letter-spacing, line-heights
  • Exact button styles (border-radius, padding, colors, border)
  • Layout structure: columns, grid, flexbox alignment
  • Spacing and padding between sections
  • Navigation bar height and style
  • Card styles, shadows, borders
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🖼️ EXTRACTED IMAGE ASSETS (use these EXACT URLs in <img> tags):
${imageInventory}

📋 SITE CONTENT (from content scanner):
${scrapedMarkdown.slice(0, 8000)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 ABSOLUTE RULES — ZERO TOLERANCE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. COLORS: Read every color DIRECTLY from the screenshot. Do NOT invent or approximate. If the background is #0F0F0F, write #0F0F0F.
2. IMAGES: Use ONLY the URLs from the image list above. Do NOT use placeholder images, unsplash, or Lorem Picsum.
3. ICONS: Do NOT use lucide-react or react-icons. Use the actual SVG image URLs from the list, or inline SVG paths you can see in the screenshot.
4. LAYOUT: Match the screenshot EXACTLY — column structure, hero section layout, navbar items, card arrangement.
5. SCOPE: Build ONLY this landing page. No routing, no secondary pages.
6. INTERACTIVITY: All buttons must have hover effects that match the site's design.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📤 REQUIRED RESPONSE FORMAT:
Before generating code, output your agent analysis:

**🎨 Color Palette Identified:**
(list background, primary text, accent/brand, button colors with exact hex values)

**📐 Layout Breakdown:**
(describe each section: Navbar → Hero → Stats/Features → etc.)

**🖼️ Images Being Used:**
(list which image URLs you are using and where)

**💬 Builder Handoff Prompt:**
> (the exact concise instruction you are passing to yourself as the code generator)

THEN build the pixel-perfect clone.`;

              if (typeof lastMessage.content === 'string') {
                lastMessage.content = lastMessage.content.replace(/\[Clone Website:\s*([^\]]+)\]/, cloneInstruction);
              }

              // ─── STEP 6: Inject the REAL screenshot bytes into the message ─────────
              // This sends the actual image data (not a URL) so any vision model can read it
              if (screenshotBase64) {
                const dataUrl = `data:${screenshotMimeType};base64,${screenshotBase64}`;
                lastMessage.experimental_attachments = [
                  ...(lastMessage.experimental_attachments || []),
                  { url: dataUrl, contentType: screenshotMimeType }
                ];
              }

              dataStream.writeData({
                type: 'progress',
                label: 'scraping',
                status: 'complete',
                order: progressCounter++,
                message: screenshotBase64
                  ? `Visual scan complete — screenshot captured + ${extractedImages.length} assets. AI is analyzing...`
                  : `Content extracted (${extractedImages.length} assets). AI is building...`,
              } satisfies ProgressAnnotation);

            } catch (error: any) {
              logger.error('Failed to scrape clone website:', error);
              if (typeof lastMessage.content === 'string') {
                lastMessage.content = lastMessage.content.replace(/\[Clone Website:\s*([^\]]+)\]/, `\n\n[CLONE INSTRUCTION]\n(Failed to fetch website content: ${error.message}. Please check the URL and try again.)`);
              }
              dataStream.writeData({
                type: 'progress',
                label: 'scraping',
                status: 'complete',
                order: progressCounter++,
                message: 'Visual scan failed — check URL and try again.',
              } satisfies ProgressAnnotation);
            }
          }
        }

        if (processedMessages.length > 3) {
          messageSliceId = processedMessages.length - 3;
        }

        if (filePaths.length > 0 && contextOptimization) {
          logger.debug('Generating Chat Summary');
          dataStream.writeData({
            type: 'progress',
            label: 'summary',
            status: 'in-progress',
            order: progressCounter++,
            message: 'Analysing Request',
          } satisfies ProgressAnnotation);

          // Create a summary of the chat
          console.log(`Messages count: ${processedMessages.length}`);

          summary = await createSummary({
            messages: [...processedMessages],
            env: context?.cloudflare?.env,
            apiKeys,
            providerSettings,
            promptId,
            contextOptimization,
            onFinish(resp) {
              if (resp.usage) {
                logger.debug('createSummary token usage', JSON.stringify(resp.usage));
                cumulativeUsage.completionTokens += resp.usage.completionTokens || 0;
                cumulativeUsage.promptTokens += resp.usage.promptTokens || 0;
                cumulativeUsage.totalTokens += resp.usage.totalTokens || 0;
              }
            },
          });
          dataStream.writeData({
            type: 'progress',
            label: 'summary',
            status: 'complete',
            order: progressCounter++,
            message: 'Analysis Complete',
          } satisfies ProgressAnnotation);

          dataStream.writeMessageAnnotation({
            type: 'chatSummary',
            summary,
            chatId: processedMessages.slice(-1)?.[0]?.id,
          } as ContextAnnotation);

          // Update context buffer
          logger.debug('Updating Context Buffer');
          dataStream.writeData({
            type: 'progress',
            label: 'context',
            status: 'in-progress',
            order: progressCounter++,
            message: 'Determining Files to Read',
          } satisfies ProgressAnnotation);

          // Select context files
          console.log(`Messages count: ${processedMessages.length}`);
          filteredFiles = await selectContext({
            messages: [...processedMessages],
            env: context?.cloudflare?.env,
            apiKeys,
            files,
            providerSettings,
            promptId,
            contextOptimization,
            summary,
            onFinish(resp) {
              if (resp.usage) {
                logger.debug('selectContext token usage', JSON.stringify(resp.usage));
                cumulativeUsage.completionTokens += resp.usage.completionTokens || 0;
                cumulativeUsage.promptTokens += resp.usage.promptTokens || 0;
                cumulativeUsage.totalTokens += resp.usage.totalTokens || 0;
              }
            },
          });

          if (filteredFiles) {
            logger.debug(`files in context : ${JSON.stringify(Object.keys(filteredFiles))}`);
          }

          dataStream.writeMessageAnnotation({
            type: 'codeContext',
            files: Object.keys(filteredFiles).map((key) => {
              let path = key;

              if (path.startsWith(WORK_DIR)) {
                path = path.replace(WORK_DIR, '');
              }

              return path;
            }),
          } as ContextAnnotation);

          dataStream.writeData({
            type: 'progress',
            label: 'context',
            status: 'complete',
            order: progressCounter++,
            message: 'Code Files Selected',
          } satisfies ProgressAnnotation);

          // logger.debug('Code Files Selected');
        }

        const mcpTools = mcpEnabled && mcpService ? { toolChoice: 'auto' as const, tools: mcpService.toolsWithoutExecute } : {};
        
        let supabaseProjectData: any = undefined;
        const liveDeductionState = { deductedCents: 0 };
        
        if (chatId) {
          try {
            supabaseProjectData = await SupabaseService.getOrCreateSupabaseProject(chatId);
          } catch (e: any) {
            logger.error("Supabase provisioning failed:", e);
            dataStream.writeData({
              type: 'progress',
              label: 'database',
              status: 'complete',
              order: progressCounter++,
              message: e.message || 'Database provisioning failed',
            } satisfies ProgressAnnotation);
          }
        }

        const options: StreamingOptions = {
          supabaseConnection: supabase,
          ...mcpTools,
          maxSteps: maxLLMSteps,
          experimental_continueSteps: true,
          onStepFinish: ({ toolCalls }) => {
            if (!mcpService) return;
            toolCalls.forEach((toolCall) => {
              mcpService.processToolCall(toolCall, dataStream);
            });
          },
          onFinish: async ({ text: content, finishReason, usage }) => {
            logger.debug('usage', JSON.stringify(usage));

            if (usage) {
              cumulativeUsage.completionTokens += usage.completionTokens || 0;
              cumulativeUsage.promptTokens += usage.promptTokens || 0;
              cumulativeUsage.totalTokens += usage.totalTokens || 0;
              
              // Calculate cost in cents with markup
              const inputTokens = usage.promptTokens || 0;
              const outputTokens = usage.completionTokens || 0;
              const costCents = Math.ceil((inputTokens * 0.002) + (outputTokens * 0.006));
              const remainingCents = Math.max(0, costCents - liveDeductionState.deductedCents);
              
              if (remainingCents > 0) {
                try {
                  await db.update(users).set({ balance: sql`${users.balance} - ${remainingCents}` }).where(eq(users.id, userId));
                } catch(e) {
                  logger.error('Failed to deduct credits:', e);
                }
              }
            }

            dataStream.writeMessageAnnotation({
              type: 'usage',
              value: {
                completionTokens: cumulativeUsage.completionTokens,
                promptTokens: cumulativeUsage.promptTokens,
                totalTokens: cumulativeUsage.totalTokens,
              },
            });
            dataStream.writeData({
              type: 'progress',
              label: 'response',
              status: 'complete',
              order: progressCounter++,
              message: 'Response Generated',
            } satisfies ProgressAnnotation);
            await new Promise((resolve) => setTimeout(resolve, 0));

            return;
          },
        };

        dataStream.writeData({
          type: 'progress',
          label: 'response',
          status: 'in-progress',
          order: progressCounter++,
          message: 'Generating Response',
        } satisfies ProgressAnnotation);

        const result = await streamText({
          messages: [...processedMessages],
          env: context?.cloudflare?.env,
          options,
          apiKeys,
          files,
          providerSettings,
          promptId,
          contextOptimization,
          contextFiles: filteredFiles,
          chatMode,
          designScheme,
          summary,
          messageSliceId,
          supabaseProjectData,
        });

        let generatedChars = 0;
        let lastDeductedChars = 0;
        const charsPerCent = 666; // approx 1 cent per 166 tokens (at 0.006 cents/token markup)

        (async () => {
          for await (const part of result.fullStream) {
            streamRecovery.updateActivity();

            // Track generated characters for live deduction
            if (part.type === 'text-delta' && typeof part.textDelta === 'string') {
              generatedChars += part.textDelta.length;
              
              if (generatedChars >= lastDeductedChars + charsPerCent) {
                lastDeductedChars = generatedChars;
                liveDeductionState.deductedCents += 1;
                
                // Live deduct 1 cent
                try {
                  const dbRes = await db.update(users)
                    .set({ balance: sql`${users.balance} - 1` })
                    .where(eq(users.id, userId))
                    .returning({ balance: users.balance });
                  
                  if (dbRes[0] && dbRes[0].balance <= 0) {
                    logger.warn('User ran out of credits during stream');
                    // We can't cleanly stop the AI stream from here without a complex abort controller,
                    // but we can at least stop recording deductions, and the next request will be blocked.
                  }
                } catch(e) {
                  // Ignore DB errors in rapid stream to avoid breaking
                }
              }
            }

            if (part.type === 'error') {
              const error: any = part.error;
              logger.error('Streaming error:', error);
              streamRecovery.stop();

              // Enhanced error handling for common streaming issues
              if (error.message?.includes('Invalid JSON response')) {
                logger.error('Invalid JSON response detected - likely malformed API response');
              } else if (error.message?.includes('token')) {
                logger.error('Token-related error detected - possible token limit exceeded');
              }

              return;
            }
          }
          streamRecovery.stop();
        })();
        result.mergeIntoDataStream(dataStream);
      },
      onError: (error: any) => {
        // Provide more specific error messages for common issues
        const errorMessage = error.message || 'Unknown error';

        if (errorMessage.includes('model') && errorMessage.includes('not found')) {
          return 'Custom error: Invalid model selected. Please check that the model name is correct and available.';
        }

        if (errorMessage.includes('Invalid JSON response')) {
          return 'Custom error: The AI service returned an invalid response. This may be due to an invalid model name, API rate limiting, or server issues. Try selecting a different model or check your API key.';
        }

        if (
          errorMessage.includes('API key') ||
          errorMessage.includes('unauthorized') ||
          errorMessage.includes('authentication')
        ) {
          return 'Custom error: Invalid or missing API key. Please check your API key configuration.';
        }

        if (errorMessage.includes('token') && errorMessage.includes('limit')) {
          return 'Custom error: Token limit exceeded. The conversation is too long for the selected model. Try using a model with larger context window or start a new conversation.';
        }

        if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
          return 'Custom error: API rate limit exceeded. Please wait a moment before trying again.';
        }

        if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
          return 'Custom error: Network error. Please check your internet connection and try again.';
        }

        return `Custom error: ${errorMessage}`;
      },
    }).pipeThrough(
      new TransformStream({
        transform: (chunk, controller) => {
          if (!lastChunk) {
            lastChunk = ' ';
          }

          if (typeof chunk === 'string') {
            if (chunk.startsWith('g') && !lastChunk.startsWith('g')) {
              controller.enqueue(encoder.encode(`0: "<div class=\\"__falborThought__\\">"\n`));
            }

            if (lastChunk.startsWith('g') && !chunk.startsWith('g')) {
              controller.enqueue(encoder.encode(`0: "</div>\\n"\n`));
            }
          }

          lastChunk = chunk;

          let transformedChunk = chunk;

          if (typeof chunk === 'string' && chunk.startsWith('g')) {
            let content = chunk.split(':').slice(1).join(':');

            if (content.endsWith('\n')) {
              content = content.slice(0, content.length - 1);
            }

            transformedChunk = `0:${content}\n`;
          }

          // Convert the string stream to a byte stream
          const str = typeof transformedChunk === 'string' ? transformedChunk : JSON.stringify(transformedChunk);
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
  } catch (error: any) {
    logger.error(error);

    const errorResponse = {
      error: true,
      message: error.message || 'An unexpected error occurred',
      statusCode: error.statusCode || 500,
      isRetryable: error.isRetryable !== false, // Default to retryable unless explicitly false
      provider: error.provider || 'unknown',
    };

    if (error.message?.includes('API key')) {
      return new Response(
        JSON.stringify({
          ...errorResponse,
          message: 'Invalid or missing API key',
          statusCode: 401,
          isRetryable: false,
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
          statusText: 'Unauthorized',
        },
      );
    }

    return new Response(JSON.stringify(errorResponse), {
      status: errorResponse.statusCode,
      headers: { 'Content-Type': 'application/json' },
      statusText: 'Error',
    });
  }
}
