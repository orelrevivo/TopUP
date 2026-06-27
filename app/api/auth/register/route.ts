import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { hashPassword, createToken, SESSION_DURATION_DAYS } from "~/lib/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as { email: string; password: string };

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (existingUser.length > 0) {
      return new Response(JSON.stringify({ error: "Email already registered" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db.insert(users).values({ email, passwordHash }).returning();

    const token = await createToken(user.id);
    const maxAge = SESSION_DURATION_DAYS * 24 * 60 * 60;
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    const isSecure = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    const secureFlag = isSecure ? "Secure; " : "";

    const body = JSON.stringify({
      user: { id: user.id, email: user.email, displayName: user.displayName },
      token,
    });

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `session=${token}; HttpOnly; ${secureFlag}Path=/; SameSite=Lax; Max-Age=${maxAge}; Expires=${expires}`,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
