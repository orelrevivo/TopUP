import { NextResponse } from "next/server";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { hashPassword, createToken, SESSION_DURATION_DAYS } from "~/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db.insert(users).values({ email, passwordHash }).returning();

    const token = await createToken(user.id);
    const maxAge = SESSION_DURATION_DAYS * 24 * 60 * 60;

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
      path: "/",
      maxAge,
      expires: new Date(Date.now() + maxAge * 1000),
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
