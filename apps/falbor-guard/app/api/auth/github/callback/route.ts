import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new NextResponse('Missing code parameter from GitHub', { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse('GitHub OAuth credentials are not configured in .env', { status: 500 });
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Ensure GitHub returns JSON
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new NextResponse(`GitHub Error: ${tokenData.error_description || tokenData.error}`, { status: 400 });
    }

    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return new NextResponse('Failed to retrieve access token from GitHub', { status: 500 });
    }

    // Save the token securely in cookies (just like the PAT flow)
    cookies().set('github_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Redirect the user back to the Settings page
    return NextResponse.redirect(new URL('/dashboard/settings', request.url));
  } catch (error: any) {
    console.error('OAuth Exchange Error:', error);
    return new NextResponse('Internal Server Error during OAuth exchange', { status: 500 });
  }
}
