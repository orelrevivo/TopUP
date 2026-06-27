import { NextResponse } from "next/server";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { verifyPassword, createToken, SESSION_DURATION_DAYS } from "~/lib/auth";
import { eq } from "drizzle-orm";

function setSessionCookie(response: NextResponse, token: string) {
  const maxAge = SESSION_DURATION_DAYS * 24 * 60 * 60;
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
  const isSecure = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  const secureFlag = isSecure ? "Secure; " : "";
  response.headers.set(
    "Set-Cookie",
    `session=${token}; HttpOnly; ${secureFlag}Path=/; SameSite=Lax; Max-Age=${maxAge}; Expires=${expires}`,
  );
}

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createToken(user.id);

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });

    setSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
