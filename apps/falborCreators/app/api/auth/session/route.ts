import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;
const COOKIE_NAME = process.env.COOKIE_NAME || "session";

export async function GET() {
  const sessionToken = cookies().get(COOKIE_NAME)?.value;

  if (!sessionToken || !JWT_SECRET) {
    return NextResponse.json({ user: null });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = (payload.userId || payload.sub || payload.id) as string;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: userId,
        email: (payload.email as string) || "creator@falbor.com",
        displayName: (payload.displayName as string) || "Stream Creator",
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
