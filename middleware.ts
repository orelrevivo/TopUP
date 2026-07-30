import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : null;
const COOKIE_NAME = "session";
const PUBLIC_ROUTES = ["/login", "/signup", "/privacy", "/api/auth/login", "/api/auth/register", "/api/auth/logout", "/api/health"];
const STATIC_PREFIXES = ["/_next", "/favicon", "/icons", "/logo", "/apple-touch-icon", "/social_preview", "/landing"];

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const STATIC_EXTENSIONS = /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf|eot|pdf)$/i;

    if (
      STATIC_EXTENSIONS.test(pathname) ||
      PUBLIC_ROUTES.some((r) => pathname === r) ||
      STATIC_PREFIXES.some((p) => pathname.startsWith(p))
    ) {
      return NextResponse.next();
    }

    const hostname = request.headers.get("host") || "";
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");

    // Redirect falbor.xyz/hacking to hacking.falbor.xyz in production
    if (!isLocalhost && pathname.startsWith("/hacking")) {
      const newUrl = new URL(request.url);
      newUrl.hostname = "hacking.falbor.xyz";
      newUrl.pathname = pathname.replace(/^\/hacking/, "") || "/";
      return NextResponse.redirect(newUrl);
    }

    // Serve index.html implicitly for deployed sites
    if (pathname.startsWith('/site/')) {
      return NextResponse.rewrite(new URL(`${pathname === '/site/' ? pathname : pathname.replace(/\/$/, '')}/index.html`, request.url));
    }

    if (pathname === "/api/auth/me") {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(COOKIE_NAME);

    const handleSuccess = () => {
      const hostname = request.headers.get("host") || "";
      const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");

      if (!isLocalhost && hostname === "hacking.falbor.xyz") {
        const rewritePath = pathname === "/" ? "/hacking" : `/hacking${pathname}`;
        return NextResponse.rewrite(new URL(rewritePath, request.url));
      }
      return NextResponse.next();
    };

    if (!sessionCookie) {
      if (pathname === "/" || pathname.startsWith("/api/") || pathname.startsWith("/chat/")) {
        return handleSuccess();
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (JWT_SECRET) {
      try {
        await jwtVerify(sessionCookie.value, JWT_SECRET);
        return handleSuccess();
      } catch {
        // Token invalid — let API routes handle auth
      }
    }

    if (pathname === "/" || pathname.startsWith("/api/") || pathname.startsWith("/chat/")) {
      return handleSuccess();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
