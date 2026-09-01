import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new NextResponse('GITHUB_CLIENT_ID is not configured in .env', { status: 500 });
  }

  const scope = 'repo read:user';
  
  // Dynamically determine the origin (e.g. http://localhost:3000)
  const origin = new URL(request.url).origin;

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.append('client_id', clientId);
  githubAuthUrl.searchParams.append('scope', scope);
  githubAuthUrl.searchParams.append('redirect_uri', `${origin}/api/auth/github/callback`);

  return NextResponse.redirect(githubAuthUrl.toString());
}
