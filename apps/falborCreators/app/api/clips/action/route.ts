import { NextResponse } from "next/server";
import { db } from "@/db";
import { creatorClips } from "@/db/schema";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq, and } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;
const COOKIE_NAME = process.env.COOKIE_NAME || "session";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sessionToken = cookies().get(COOKIE_NAME)?.value;
  if (!sessionToken || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = (payload.userId || payload.sub || payload.id) as string;
    const { clipId, action } = await req.json();

    const [clip] = await db.select().from(creatorClips).where(and(eq(creatorClips.id, clipId), eq(creatorClips.userId, userId)));
    if (!clip) {
      return NextResponse.json({ error: "Clip not found" }, { status: 404 });
    }

    if (action === "approve") {
      await db.update(creatorClips).set({ status: "approved" }).where(eq(creatorClips.id, clipId));
    } else if (action === "publish") {
      await db.update(creatorClips).set({ status: "published" }).where(eq(creatorClips.id, clipId));
    } else if (action === "reject") {
      await db.update(creatorClips).set({ status: "rejected" }).where(eq(creatorClips.id, clipId));
    }

    return NextResponse.json({ success: true, status: action });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
