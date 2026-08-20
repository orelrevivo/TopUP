'use server';

import { db } from '@/db';
import { globalSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getGlobalSettings() {
  const existing = await db.select().from(globalSettings).where(eq(globalSettings.id, 1));
  if (existing.length > 0) {
    return existing[0];
  }

  // Create default if it doesn't exist
  const inserted = await db.insert(globalSettings).values({
    id: 1,
    riskyPathKeywords: 'auth, billing, security, payment',
    largePrThreshold: 15,
    missingTests: true,
    dependencyChange: true,
    reportFormat: 'Markdown (GitHub Style)',
    includeLowRisk: false,
    enablePostToGitHub: true,
  }).returning();

  return inserted[0];
}

export async function updateGlobalSettings(data: any) {
  const existing = await db.select().from(globalSettings).where(eq(globalSettings.id, 1));

  if (existing.length === 0) {
    await db.insert(globalSettings).values({ id: 1, ...data });
  } else {
    await db.update(globalSettings).set(data).where(eq(globalSettings.id, 1));
  }

  revalidatePath('/dashboard/settings');
}
