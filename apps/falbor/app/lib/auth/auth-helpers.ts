import { db } from '~/lib/db';
import { chats, workflows, deployments } from '~/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUserId } from '~/lib/auth/server';

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function requireUser() {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new AuthError(401, 'Unauthorized');
  }
  return userId;
}

export async function requireChatAccess(chatId: string) {
  const userId = await requireUser();
  const [chat] = await db
    .select()
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))
    .limit(1);
  if (!chat) {
    throw new AuthError(403, 'Forbidden: Chat access denied');
  }
  return chat;
}

export async function requireWorkflowAccess(workflowId: string) {
  const userId = await requireUser();
  const [workflow] = await db
    .select()
    .from(workflows)
    .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)))
    .limit(1);
  if (!workflow) {
    throw new AuthError(403, 'Forbidden: Workflow access denied');
  }
  return workflow;
}

export async function requireDeploymentAccess(chatId: string) {
  // Check that the user has access to the chat
  await requireChatAccess(chatId);
  const [deployment] = await db
    .select()
    .from(deployments)
    .where(eq(deployments.chatId, chatId))
    .limit(1);
  return deployment;
}

export async function requireProjectAccess(projectId: string, allowedRoles?: string[]) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new AuthError(401, 'Unauthorized');
  }
  // Lazy require schema to avoid circular references if any
  const { projects, users } = require('~/lib/db/schema');
  
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);
    
  if (!project) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (!user) {
      throw new AuthError(403, 'Forbidden: Project access denied');
    }
    if (allowedRoles && !allowedRoles.includes(user.role || '')) {
      throw new AuthError(403, 'Forbidden: Insufficient role permissions');
    }
  }
  return project;
}

export function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  console.error("Authentication/Authorization error:", error);
  return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
