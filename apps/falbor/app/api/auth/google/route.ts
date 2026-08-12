import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { createToken, SESSION_DURATION_DAYS } from "~/lib/auth";
import { eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    let credential = "";
    let isFormData = false;

    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { credential?: string };
      credential = body.credential || "";
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      credential = formData.get("credential")?.toString() || "";
      isFormData = true;
    }

    if (!credential) {
      return new Response(JSON.stringify({ error: "No credential provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: [
        process.env.GOOGLE_CLIENT_ID || "",
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      ].filter(Boolean), 
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return new Response(JSON.stringify({ error: "Invalid Google token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { email, name, picture } = payload;

    // Check if user exists
    let [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      // Create new user if they don't exist
      const baseUsername = (name || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9]/g, '');
      const uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;

      const [newUser] = await db.insert(users).values({
        email,
        username: uniqueUsername,
        displayName: name || email.split("@")[0],
        avatarUrl: picture || null,
      }).returning();
      
      user = newUser;
    } else if (user.passwordHash) {
      // User exists but has a password (they signed up with email/password)
      return new Response(JSON.stringify({ error: "This email is registered with a password. Please log in with your email and password." }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate session token
    const token = await createToken(user.id);
    const maxAge = SESSION_DURATION_DAYS * 24 * 60 * 60;
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    const cookieFlags = isProduction
      ? `HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${maxAge}; Expires=${expires}`
      : `HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}; Expires=${expires}`;

    const cookieString = `session=${token}; ${cookieFlags}`;

    if (isFormData) {
      // If it was a form post (Google redirect flow), redirect the browser to home
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": cookieString,
        },
      });
    }

    // Otherwise (JSON API call like One Tap), return JSON
    const body = JSON.stringify({
      user: { id: user.id, email: user.email, displayName: user.displayName },
      token,
    });

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieString,
      },
    });
  } catch (error) {
    console.error("Google Login error:", error);
    
    // If it was a form post, maybe redirect to login page with an error
    return new Response(JSON.stringify({ error: "Internal server error during Google Login" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
