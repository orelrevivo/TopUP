import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "session";
const PUBLIC_ROUTES = ["/login", "/signup", "/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/health"];
const STATIC_PREFIXES = ["/_next", "/favicon", "/icons", "/logo", "/apple-touch-icon", "/social_preview"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((r) => pathname === r) || STATIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (pathname === "/api/auth/me") {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME);
  if (!sessionCookie) {
    if (pathname === "/" || pathname.startsWith("/api/")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(sessionCookie.value, JWT_SECRET);
    return NextResponse.next();
  } catch {
    if (pathname === "/" || pathname.startsWith("/api/")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
