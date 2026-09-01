import { NextRequest, NextResponse } from 'next/server';
import { db } from '~/lib/db';
import { mcpConnections } from '~/lib/db/schema';
import { getUserId } from '~/lib/auth';
import { eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.redirect(new URL('/?error=Unauthorized', request.url));
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const stateStr = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Gmail Auth Error:', error);
      return NextResponse.redirect(new URL('/?error=GmailAuthFailed', request.url));
    }

    if (!code || !stateStr) {
      return NextResponse.redirect(new URL('/?error=MissingParams', request.url));
    }

    const state = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf-8'));
    if (state.userId !== userId) {
      return NextResponse.redirect(new URL('/?error=InvalidState', request.url));
    }

    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const redirectUri = process.env.NODE_ENV === 'production' 
      ? process.env.GMAIL_REDIRECT_URI_PROD 
      : process.env.GMAIL_REDIRECT_URI_LOCAL;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(new URL('/?error=MissingGmailConfig', request.url));
    }

    // Exchange the code for an access/refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Gmail Token Error:', tokenData);
      return NextResponse.redirect(new URL('/?error=TokenExchangeFailed', request.url));
    }

    // Attempt to fetch user info from Google
    if (tokenData.access_token) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        if (userInfoRes.ok) {
          const userInfo = await userInfoRes.json();
          // Embed in authed_user to match extraction logic
          tokenData.authed_user = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.picture,
          };
        }
      } catch (err) {
        console.error('Failed to fetch Gmail user info:', err);
      }
    }

    // Save connection to database
    if (state.connectionId) {
      await db.update(mcpConnections)
        .set({ config: tokenData, updatedAt: new Date() })
        .where(and(eq(mcpConnections.id, state.connectionId), eq(mcpConnections.userId, userId)));
    } else {
      await db.insert(mcpConnections).values({
        userId,
        connectorId: 'gmail',
        name: state.name || 'Gmail Connection',
        config: tokenData, // Includes access_token, refresh_token, expires_in, authed_user
        status: 'active',
      });
    }

    return NextResponse.redirect(new URL('/?tab=mcp', request.url));
  } catch (error) {
    console.error('Gmail Callback Error:', error);
    return NextResponse.redirect(new URL('/?error=InternalServerError', request.url));
  }
}
