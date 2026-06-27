import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.VERCEL === "1" || process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
}
