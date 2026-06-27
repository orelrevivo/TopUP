import { NextRequest, NextResponse } from "next/server";
import { db } from "~/lib/db";
import { chats, messages } from "~/lib/db/schema";
import { getUserId } from "~/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const list = await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.updatedAt));
    return NextResponse.json(list);
  } catch (e) {
    console.error("GET /api/data/chats error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as {
      id: string; messages: any[]; urlId?: string; description?: string; timestamp?: string; metadata?: any;
    };
    const { id, messages: msgs, urlId, description: desc_text, timestamp, metadata } = body;
    const [chat] = await db
      .insert(chats)
      .values({
        id,
        userId,
        title: desc_text || "New Chat",
        description: desc_text,
        model: metadata?.model,
        provider: metadata?.provider,
        ...(timestamp ? { createdAt: new Date(timestamp), updatedAt: new Date() } : {}),
      })
      .onConflictDoUpdate({ target: chats.id, set: { title: desc_text || "New Chat", description: desc_text, updatedAt: new Date() } })
      .returning();
    if (msgs?.length) {
      const msgRows = msgs.map((m: any) => ({
        id: m.id,
        chatId: id,
        role: m.role,
        content: m.content || null,
        parts: m.parts ? JSON.stringify(m.parts) : null,
      }));
      await db.delete(messages).where(eq(messages.chatId, id));
      if (msgRows.length) await db.insert(messages).values(msgRows).onConflictDoNothing();
    }
    return NextResponse.json(chat);
  } catch (e) {
    console.error("POST /api/data/chats error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
