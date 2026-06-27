import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import type { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const COOKIE_NAME = "session";
const HEADER_NAME = "x-session-token";
export const SESSION_DURATION_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DURATION_DAYS}d`)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.error("verifyToken error:", errMsg);
    // @ts-ignore
    globalThis.__lastAuthError = `Verification failed: ${errMsg}. Token length: ${token?.length}. Secret length: ${process.env.JWT_SECRET?.length ?? 0}`;
    return null;
  }
}

export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export async function getUserId(request: NextRequest): Promise<string | null> {
  // Try Next.js cookies API first
  const cookieVal = request.cookies.get(COOKIE_NAME)?.value ?? null;
  if (cookieVal) {
    const payload = await verifyToken(cookieVal);
    if (payload?.userId) return payload.userId;
  }

  // Fallback: parse raw Cookie header directly
  // (works around a known Next.js edge-runtime bug where
  //  request.cookies.get() returns undefined despite the
  //  cookie being present in the request)
  const rawCookie = request.headers.get("cookie");
  if (rawCookie) {
    const match = rawCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    if (match) {
      const payload = await verifyToken(match[1]);
      if (payload?.userId) return payload.userId;
    }
  }

  // Final fallback: x-session-token header set by localStorage backup
  const fromHeader = request.headers.get(HEADER_NAME);
  if (fromHeader) {
    const payload = await verifyToken(fromHeader);
    if (payload?.userId) return payload.userId;
  }

  return null;
}

/** Fallback: extract token from raw Cookie header string */
export function getTokenFromHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export { COOKIE_NAME };
