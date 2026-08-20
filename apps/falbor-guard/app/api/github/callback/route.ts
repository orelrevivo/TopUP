import { NextResponse } from 'next/server';
import { db } from '@/db';
import { globalSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const installationId = url.searchParams.get('installation_id');

  if (!installationId) {
    return NextResponse.redirect(new URL('/dashboard/settings?error=missing_installation_id', request.url));
  }

  // Update or insert the installation_id globally
  const existing = await db.select().from(globalSettings).where(eq(globalSettings.id, 1));
  if (existing.length > 0) {
    await db.update(globalSettings).set({ githubAppInstallationId: installationId }).where(eq(globalSettings.id, 1));
  } else {
    await db.insert(globalSettings).values({ githubAppInstallationId: installationId });
  }

  // Redirect back to settings with a success param
  return NextResponse.redirect(new URL('/dashboard/settings?app_connected=true', request.url));
}
