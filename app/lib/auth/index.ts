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
  } catch {
    return null;
  }
}

export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

export async function getUserId(request: NextRequest): Promise<string | null> {
  // Try cookie first
  const fromCookie = request.cookies.get(COOKIE_NAME)?.value ?? null;
  if (fromCookie) {
    const payload = await verifyToken(fromCookie);
    if (payload?.userId) return payload.userId;
  }

  // Fallback to x-session-token header (set by client when cookies don't work)
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
