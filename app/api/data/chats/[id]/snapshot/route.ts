import { NextRequest, NextResponse } from "next/server";
import { db } from "~/lib/db";
import { chatSnapshots } from "~/lib/db/schema";
import { getUserId } from "~/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const [snap] = await db
      .select()
      .from(chatSnapshots)
      .where(and(eq(chatSnapshots.chatId, params.id), eq(chatSnapshots.userId, userId)))
      .limit(1);
    return NextResponse.json(snap?.files ?? null);
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { snapshot } = (await request.json()) as { snapshot: any };
    const [existing] = await db
      .select()
      .from(chatSnapshots)
      .where(and(eq(chatSnapshots.chatId, params.id), eq(chatSnapshots.userId, userId)))
      .limit(1);
    if (existing) {
      await db
        .update(chatSnapshots)
        .set({ files: snapshot?.files ?? snapshot, summary: snapshot?.summary, createdAt: new Date() })
        .where(eq(chatSnapshots.id, existing.id));
    } else {
      await db.insert(chatSnapshots).values({
        chatId: params.id,
        userId,
        files: snapshot?.files ?? snapshot,
        summary: snapshot?.summary,
      });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("POST /api/data/chats/[id]/snapshot error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await db
      .delete(chatSnapshots)
      .where(and(eq(chatSnapshots.chatId, params.id), eq(chatSnapshots.userId, userId)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
