import { NextResponse } from 'next/server';
import { db } from '@/db';
import { globalSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const existing = await db.select().from(globalSettings).where(eq(globalSettings.id, 1));
    const installationId = existing[0]?.githubAppInstallationId;

    if (!installationId) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({ connected: true, installationId });
  } catch (error) {
    console.error("Error checking connection:", error);
    return NextResponse.json({ connected: false }, { status: 500 });
  }
}
