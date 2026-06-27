import { NextRequest, NextResponse } from "next/server";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { getUserId } from "~/lib/auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
