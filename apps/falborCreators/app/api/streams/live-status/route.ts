import { NextResponse } from "next/server";
import { db } from "@/db";
import { creatorAutomationSettings, creatorAccounts, creatorStreams } from "@/db/schema";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq, desc } from "drizzle-orm";
import { processStreamPipeline } from "@/lib/pipeline/orchestrator";
import { parseChannelUrl } from "@/lib/utils/channelParser";
import { getPlatformAdapter } from "@/lib/adapters";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;
const COOKIE_NAME = process.env.COOKIE_NAME || "session";

export const dynamic = "force-dynamic";

export async function GET() {
  const sessionToken = cookies().get(COOKIE_NAME)?.value;
  if (!sessionToken || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = (payload.userId || payload.sub || payload.id) as string;

    const [settings] = await db.select().from(creatorAutomationSettings).where(eq(creatorAutomationSettings.userId, userId));
    const connectedAccounts = await db.select().from(creatorAccounts).where(eq(creatorAccounts.userId, userId));

    const sourceType = settings?.sourceType || "own";
    const targetChannelUrl = settings?.targetChannelUrl || "";

    let isConfigured = false;
    let targetName = "";
    let platform = "twitch";
    let isChannelLive = false;
    let currentHandle = "";

    if (sourceType === "custom_url") {
      if (targetChannelUrl) {
        isConfigured = true;
        const parsed = parseChannelUrl(targetChannelUrl);
        platform = parsed.platform;
        targetName = parsed.cleanName;
        currentHandle = parsed.handle;

        try {
          const adapter = getPlatformAdapter(parsed.platform);
          const status = await adapter.getLiveStatus(parsed.handle);
          isChannelLive = status.isLive;
        } catch {
          // fallback
        }
      }
    } else {
      if (connectedAccounts.length > 0) {
        isConfigured = true;
        targetName = connectedAccounts[0].platformUsername;
        platform = connectedAccounts[0].platform;
        currentHandle = connectedAccounts[0].platformUsername;
      }
    }

    const streams = await db
      .select()
      .from(creatorStreams)
      .where(eq(creatorStreams.userId, userId))
      .orderBy(desc(creatorStreams.createdAt))
      .limit(10);

    const activeStream = streams.find((s) => {
      if (!currentHandle) return true;
      return (s.vodUrl && s.vodUrl.includes(currentHandle)) || (s.title && s.title.toLowerCase().includes(currentHandle.toLowerCase()));
    }) || null;

    return NextResponse.json({
      sourceType,
      targetChannelUrl,
      isConfigured,
      targetName,
      platform,
      isChannelLive,
      connectedAccountsCount: connectedAccounts.length,
      activeStream,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch live status" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const sessionToken = cookies().get(COOKIE_NAME)?.value;
  if (!sessionToken || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = (payload.userId || payload.sub || payload.id) as string;
    const body = await req.json();

    if (body.action === "stop") {
      const [latestStream] = await db
        .select()
        .from(creatorStreams)
        .where(eq(creatorStreams.userId, userId))
        .orderBy(desc(creatorStreams.createdAt))
        .limit(1);

      if (latestStream) {
        await db.update(creatorStreams).set({ status: "stopped", endedAt: new Date() }).where(eq(creatorStreams.id, latestStream.id));
      }
      return NextResponse.json({ success: true, status: "stopped" });
    }

    const [settings] = await db.select().from(creatorAutomationSettings).where(eq(creatorAutomationSettings.userId, userId));
    const sourceType = settings?.sourceType || "own";
    const targetUrl = settings?.targetChannelUrl || body.customUrl || "";

    const parsed = parseChannelUrl(targetUrl);
    const platform = parsed.platform;
    const externalStreamId = `live_${Date.now()}`;
    const cleanTitle = `${parsed.cleanName}: Live Broadcast Highlight`;

    const streamId = `stream_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    await db.insert(creatorStreams).values({
      id: streamId,
      userId,
      platform,
      externalStreamId,
      title: cleanTitle,
      status: "detected_live",
      vodUrl: targetUrl || `https://${platform}.com/${parsed.handle}`,
      durationSeconds: 3600,
      startedAt: new Date(),
    });

    processStreamPipeline(streamId).catch(() => {});

    return NextResponse.json({ success: true, streamId, title: cleanTitle });
  } catch {
    return NextResponse.json({ error: "Failed to start live stream detection" }, { status: 500 });
  }
}
