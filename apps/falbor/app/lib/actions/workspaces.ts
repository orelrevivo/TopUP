'use server'

import { db } from '~/lib/db'
import { v4 } from 'uuid'
import { workspaces } from '~/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { getAuthUserDetails } from '~/lib/visual-editor/queries'

async function getUserId() {
  const authUser = await getAuthUserDetails()
  if (!authUser) return null;
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, authUser.email),
  })
  return user?.id || null;
}

export async function createWorkspace(name: string = "Untitled Workspace") {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const id = v4();
  await db.insert(workspaces).values({
    id,
    userId,
    name,
  });
  return id;
}

export async function getLastUsedWorkspace() {
  const userId = await getUserId();
  if (!userId) return null;

  const userWorkspace = await db.query.workspaces.findFirst({
    where: (workspaces, { eq }) => eq(workspaces.userId, userId),
    orderBy: [desc(workspaces.updatedAt)],
  });

  return userWorkspace || null;
}

export async function getWorkspaceById(id: string) {
  const userId = await getUserId();
  if (!userId) return null;

  const workspace = await db.query.workspaces.findFirst({
    where: (workspaces, { eq }) => eq(workspaces.id, id),
  });
  if (!workspace) return null;

  if (workspace.userId === userId) return workspace;

  const membership = await db.query.workspaceMembers.findFirst({
    where: (m, { eq, and }) => and(eq(m.workspaceId, id), eq(m.userId, userId)),
  });

  return membership ? workspace : null;
}

export async function updateWorkspaceName(id: string, name: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  await db.update(workspaces)
    .set({ name, updatedAt: new Date() })
    .where(eq(workspaces.id, id));

  return true;
}

export async function updateWorkspaceOnboarding(id: string, contextPrompt?: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  const updateData: any = { onboardingCompleted: true, updatedAt: new Date() };
  if (contextPrompt) {
    updateData.contextPrompt = contextPrompt;

    // Extract product/project name if present in the prompt
    const nameMatch = contextPrompt.match(/(?:Product Name|Project Name|App Name|Name):\s*([^\n]+)/i);
    if (nameMatch && nameMatch[1]?.trim()) {
      updateData.name = nameMatch[1].trim();
    }

    // Extract domain or website URL if present in onboarding context
    const domainMatch = contextPrompt.match(/(?:Domain|Website|Site|URL):\s*([^\n]+)/i) || contextPrompt.match(/https?:\/\/([^\s\/]+)/i);
    if (domainMatch && domainMatch[1]?.trim()) {
      updateData.domain = domainMatch[1].trim().replace(/^https?:\/\//i, '');
    }
  }

  await db.update(workspaces)
    .set(updateData)
    .where(eq(workspaces.id, id));

  return true;
}

export async function updateWorkspaceDomain(id: string, domain: string) {
  const userId = await getUserId();
  if (!userId) throw new Error("Unauthorized");

  await db.update(workspaces)
    .set({ domain: domain.trim(), updatedAt: new Date() })
    .where(eq(workspaces.id, id));

  return true;
}

export async function getUserWorkspaces() {
  const userId = await getUserId();
  if (!userId) return [];

  const owned = await db.query.workspaces.findMany({
    where: (workspaces, { eq }) => eq(workspaces.userId, userId),
    orderBy: [desc(workspaces.updatedAt)],
  });

  const memberRows = await db.query.workspaceMembers.findMany({
    where: (m, { eq }) => eq(m.userId, userId),
  });

  if (memberRows.length === 0) return owned;

  const memberWsIds = memberRows.map((r) => r.workspaceId);
  const memberWorkspaces = await db.query.workspaces.findMany({
    where: (w, { inArray }) => inArray(w.id, memberWsIds),
  });

  const allMap = new Map();
  owned.forEach((w) => allMap.set(w.id, w));
  memberWorkspaces.forEach((w) => allMap.set(w.id, w));

  return Array.from(allMap.values());
}

