import { NextResponse } from 'next/server';

export async function GET() {
  const appSlug = process.env.NEXT_PUBLIC_GITHUB_APP_SLUG;
  if (!appSlug) {
    return new NextResponse('NEXT_PUBLIC_GITHUB_APP_SLUG is not configured', { status: 500 });
  }

  const installUrl = `https://github.com/apps/${appSlug}/installations/new`;
  return NextResponse.redirect(installUrl);
}
