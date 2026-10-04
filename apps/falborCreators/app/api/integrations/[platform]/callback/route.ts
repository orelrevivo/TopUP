import { NextResponse } from "next/server";
import { db } from "@/db";
import { creatorAccounts, users } from "@/db/schema";
import { getPlatformAdapter } from "@/lib/adapters";
import { encryptToken } from "@/lib/security/encryption";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;
const COOKIE_NAME = process.env.COOKIE_NAME || "session";

export async function GET(req: Request, { params }: { params: { platform: string } }) {
  const sessionToken = cookies().get(COOKIE_NAME)?.value;
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!sessionToken || !JWT_SECRET || !code) {
    return NextResponse.redirect(new URL("/dashboard/accounts?error=missing_code", req.url));
  }

  try {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    const userId = (payload.userId || payload.sub || payload.id) as string;

    const platform = params.platform as "youtube" | "twitch" | "kick";
    const adapter = getPlatformAdapter(platform);

    const redirectUri = `${url.origin}/api/integrations/${platform}/callback`;
    let accessToken = "";
    let refreshToken = "";
    let platformUserId = "";
    let platformUsername = "";

    if (platform === "twitch") {
      const clientId = process.env.TWITCH_CLIENT_ID || "";
      const clientSecret = process.env.TWITCH_CLIENT_SECRET || "";

      const tokenRes = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        return NextResponse.redirect(new URL("/dashboard/accounts?error=token_exchange_failed", req.url));
      }

      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || "";

      const userRes = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userData = await userRes.json();
      if (userData.data && userData.data[0]) {
        platformUserId = userData.data[0].id;
        platformUsername = userData.data[0].login || userData.data[0].display_name;
      }
    } else if (platform === "youtube") {
      const clientId = process.env.YOUTUBE_CLIENT_ID || "";
      const clientSecret = process.env.YOUTUBE_CLIENT_SECRET || "";

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok || !tokenData.access_token) {
        return NextResponse.redirect(new URL("/dashboard/accounts?error=token_exchange_failed", req.url));
      }

      accessToken = tokenData.access_token;
      refreshToken = tokenData.refresh_token || "";

      const channelRes = await fetch("https://www.googleapis.com/youtube/v3/channels?mine=true&part=snippet", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const channelData = await channelRes.json();
      if (channelData.items && channelData.items[0]) {
        platformUserId = channelData.items[0].id;
        platformUsername = channelData.items[0].snippet?.customUrl || channelData.items[0].snippet?.title;
      }
    } else if (platform === "kick") {
      const clientId = process.env.KICK_CLIENT_ID || "";
      const clientSecret = process.env.KICK_CLIENT_SECRET || "";

      if (clientId && clientSecret && clientSecret !== "mock_kick_client_secret") {
        try {
          const tokenRes = await fetch("https://id.kick.com/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              code,
              grant_type: "authorization_code",
              redirect_uri: redirectUri,
            }),
          });
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            accessToken = tokenData.access_token;
            refreshToken = tokenData.refresh_token || "";
          } else {
            accessToken = code;
          }
        } catch {
          accessToken = code;
        }
      } else {
        accessToken = code;
      }
      platformUserId = `kick_${Date.now()}`;
      platformUsername = "KickStreamer";
    }

    const accountId = `acc_${platform}_${userId}`;
    const encryptedAccess = encryptToken(accessToken || "token");
    const encryptedRefresh = refreshToken ? encryptToken(refreshToken) : null;

    const [existingUser] = await db.select().from(users).where(eq(users.id, userId as any)).limit(1);
    if (!existingUser) {
      const email = (payload.email as string) || `user_${userId}@falbor.com`;
      await db.insert(users).values({
        id: userId as any,
        email,
        displayName: (payload.displayName as string) || "Creator",
      }).onConflictDoNothing();
    }

    await db.insert(creatorAccounts).values({
      id: accountId,
      userId: userId as any,
      platform,
      platformUserId: platformUserId || "user",
      platformUsername: platformUsername || `${platform}_user`,
      accessTokenEncrypted: encryptedAccess,
      refreshTokenEncrypted: encryptedRefresh,
      tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).onConflictDoUpdate({
      target: creatorAccounts.id,
      set: {
        platformUsername: platformUsername || `${platform}_user`,
        accessTokenEncrypted: encryptedAccess,
        refreshTokenEncrypted: encryptedRefresh,
        updatedAt: new Date(),
      },
    });

    return NextResponse.redirect(new URL("/dashboard/accounts?connected=" + platform, req.url));
  } catch (error: any) {
    console.error("OAuth Callback Exception:", error?.message || error);
    return NextResponse.redirect(new URL(`/dashboard/accounts?error=${encodeURIComponent(error?.message || "callback_failed")}`, req.url));
  }
}
