import { NextRequest, NextResponse } from "next/server";
import { db } from "~/lib/db";
import { hackingChats, hackingMessages } from "~/lib/db/schema";
import { getUserId } from "~/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [chat] = await db
      .select()
      .from(hackingChats)
      .where(eq(hackingChats.id, params.id))
      .limit(1);

    if (!chat) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const msgs = await db
      .select()
      .from(hackingMessages)
      .where(eq(hackingMessages.chatId, params.id))
      .orderBy(hackingMessages.createdAt);

    const result = {
      id: chat.id,
      userId: chat.userId,
      urlId: chat.id,
      description: chat.description ?? chat.title,
      timestamp: chat.createdAt?.toISOString(),
      metadata: {},
      messages: msgs.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        parts: m.parts
          ? typeof m.parts === "string"
            ? JSON.parse(m.parts)
            : m.parts
          : undefined,
      })),
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("GET /api/data/hacking-chats/[id] error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await db.delete(hackingMessages).where(eq(hackingMessages.chatId, params.id));
    await db.delete(hackingChats).where(eq(hackingChats.id, params.id));
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/data/hacking-chats/[id] error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
