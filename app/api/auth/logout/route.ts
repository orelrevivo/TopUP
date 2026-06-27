import { NextResponse } from "next/server";

export async function POST() {
  const expires = new Date(0).toUTCString();
  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    `session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Expires=${expires}`,
  );
  return response;
}
