import { NextResponse } from "next/server";

export async function GET() {
  const youtubeClientId = process.env.YOUTUBE_CLIENT_ID || "";
  const twitchClientId = process.env.TWITCH_CLIENT_ID || "";
  const kickClientId = process.env.KICK_CLIENT_ID || "";

  return NextResponse.json({
    youtubeClientId,
    twitchClientId,
    kickClientId,
  });
}
