import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;
const COOKIE_NAME = process.env.COOKIE_NAME || "session";
const FALBOR_MAIN_URL = process.env.NEXT_PUBLIC_FALBOR_MAIN_URL || "https://localhost:3000";

const PUBLIC_ROUTES = [
  "/login",
  "/api/auth/session",
  "/api/webhooks/twitch",
  "/api/webhooks/kick",
  "/api/webhooks/youtube",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME);

  if (!sessionCookie) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }
    return NextResponse.redirect(`${FALBOR_MAIN_URL}/login?redirect=${encodeURIComponent(request.url)}`);
  }

  if (JWT_SECRET) {
    try {
      const { payload } = await jwtVerify(sessionCookie.value, JWT_SECRET);
      if (payload?.userId || payload?.sub || payload?.id) {
        return NextResponse.next();
      }
      return NextResponse.redirect(`${FALBOR_MAIN_URL}/login?redirect=${encodeURIComponent(request.url)}`);
    } catch {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Invalid session token" }, { status: 401 });
      }
      return NextResponse.redirect(`${FALBOR_MAIN_URL}/login?redirect=${encodeURIComponent(request.url)}`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
