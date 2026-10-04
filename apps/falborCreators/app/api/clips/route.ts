import { NextResponse } from "next/server";
import { db } from "@/db";
import { creatorClips } from "@/db/schema";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq, desc } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;
const COOKIE_NAME = process.env.COOKIE_NAME || "session";

export async function GET() {
  const sessionToken = cookies().get(COOKIE_NAME)?.value;
  if (!sessionToken || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = (payload.userId || payload.sub || payload.id) as string;

    const userClips = await db.select().from(creatorClips).where(eq(creatorClips.userId, userId)).orderBy(desc(creatorClips.createdAt));
    return NextResponse.json({ clips: userClips });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
