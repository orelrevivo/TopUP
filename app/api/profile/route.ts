import { NextRequest, NextResponse } from "next/server";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { getUserId } from "~/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db
    .select({ displayName: users.displayName, avatarUrl: users.avatarUrl, bio: users.bio })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({
    username: user.displayName || "",
    avatar: user.avatarUrl || "",
    bio: user.bio || "",
  });
}

export async function PUT(request: NextRequest) {
  const userId = await getUserId(request);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username, avatar, bio } = (await request.json()) as {
    username?: string;
    avatar?: string;
    bio?: string;
  };

  await db
    .update(users)
    .set({
      displayName: username,
      avatarUrl: avatar,
      bio,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  return NextResponse.json({ success: true });
}
