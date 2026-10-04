import { NextResponse } from "next/server";
import { db } from "@/db";
import { creatorAutomationSettings } from "@/db/schema";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;
const COOKIE_NAME = process.env.COOKIE_NAME || "session";

export async function GET() {
  const sessionToken = cookies().get(COOKIE_NAME)?.value;
  if (!sessionToken || !JWT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = (payload.userId || payload.sub || payload.id) as string;

    let [settings] = await db.select().from(creatorAutomationSettings).where(eq(creatorAutomationSettings.userId, userId));
    if (!settings) {
      const defaultId = `sett_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await db.insert(creatorAutomationSettings).values({
        id: defaultId,
        userId,
        autoPublish: false,
        manualApproval: true,
        maxClipsPerStream: 3,
        minClipScore: 70,
        language: "en",
        captionStyle: "modern_bold",
        uploadPrivacy: "unlisted",
        sourceType: "own",
        targetChannelUrl: "",
      });
      [settings] = await db.select().from(creatorAutomationSettings).where(eq(creatorAutomationSettings.userId, userId));
    }

    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    await db.update(creatorAutomationSettings).set({
      autoPublish: body.autoPublish,
      manualApproval: body.manualApproval,
      maxClipsPerStream: body.maxClipsPerStream,
      minClipScore: body.minClipScore,
      language: body.language,
      captionStyle: body.captionStyle,
      uploadPrivacy: body.uploadPrivacy,
      sourceType: body.sourceType ?? "own",
      targetChannelUrl: body.targetChannelUrl ?? "",
      updatedAt: new Date(),
    }).where(eq(creatorAutomationSettings.userId, userId));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
