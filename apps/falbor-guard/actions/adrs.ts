'use server';

import { db } from '@/db';
import { adrRules } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getAdrRules(repositoryId: string) {
  return await db.select().from(adrRules).where(eq(adrRules.repositoryId, repositoryId));
}

export async function createAdrRule(data: { repositoryId: string, title: string, description: string, severity: string }) {
  await db.insert(adrRules).values({
    repositoryId: data.repositoryId,
    title: data.title,
    description: data.description,
    severity: data.severity,
  });
  revalidatePath('/dashboard/adrs');
}

export async function deleteAdrRule(ruleId: string) {
  await db.delete(adrRules).where(eq(adrRules.id, ruleId));
  revalidatePath('/dashboard/adrs');
}
