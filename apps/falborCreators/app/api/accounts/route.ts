import { NextResponse } from "next/server";
import { db } from "@/db";
import { creatorAccounts } from "@/db/schema";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";

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

    const accounts = await db.select({
      id: creatorAccounts.id,
      platform: creatorAccounts.platform,
      platformUsername: creatorAccounts.platformUsername,
      createdAt: creatorAccounts.createdAt,
    }).from(creatorAccounts).where(eq(creatorAccounts.userId, userId));

    return NextResponse.json({ accounts });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  const sessionToken = cookies().get(COOKIE_NAME)?.value;
  if (!sessionToken || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = (payload.userId || payload.sub || payload.id) as string;
    const url = new URL(req.url);
    const platform = url.searchParams.get("platform");

    if (platform) {
      await db.delete(creatorAccounts).where(
        eq(creatorAccounts.userId, userId)
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }
}
