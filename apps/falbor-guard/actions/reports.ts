'use server';

import { db } from '@/db';
import { prReports } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getReports() {
  return await db.select().from(prReports).orderBy(desc(prReports.createdAt));
}

export async function getReportById(id: string) {
  const result = await db.select().from(prReports).where(eq(prReports.id, id));
  return result[0] || null;
}

export async function saveReport(data: { repositoryId: string, prNumber: string, title: string, riskLevel: string, summary: string, markdownReport: string }) {
  const inserted = await db.insert(prReports).values({
    repositoryId: data.repositoryId,
    prNumber: data.prNumber,
    title: data.title,
    riskLevel: data.riskLevel,
    summary: data.summary,
    markdownReport: data.markdownReport,
  }).returning();
  
  revalidatePath('/dashboard/reports');
  return inserted[0];
}
