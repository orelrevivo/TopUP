import { NextResponse } from 'next/server';
import { db } from '~/lib/db';
import { workflows, workflowVersions, users } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { workflowId, name, description, nodes, edges, thumbnailUrl, chatId } = await req.json();

    let currentWorkflowId = workflowId;
    let version = 1;

    if (!currentWorkflowId) {
      // Find a default user to satisfy foreign key constraint
      const [defaultUser] = await db.select().from(users).limit(1);
      if (!defaultUser) {
        return NextResponse.json({ error: 'No users found in database' }, { status: 400 });
      }

      // Create new workflow
      const [newWorkflow] = await db.insert(workflows)
        .values({
          name: name || 'Untitled Workflow',
          description: description || '',
          userId: defaultUser.id,
          chatId: chatId || null,
          status: 'draft',
          thumbnailUrl: thumbnailUrl || null,
        })
        .returning();
      currentWorkflowId = newWorkflow.id;
    } else {
      // Update the existing workflow's name, description, and thumbnail if provided
      await db.update(workflows)
        .set({
          name: name || 'Untitled Workflow',
          description: description || '',
          ...(thumbnailUrl ? { thumbnailUrl } : {}),
          updatedAt: new Date(),
        })
        .where(eq(workflows.id, currentWorkflowId));

      // Get current version to increment
      const versions = await db.select()
        .from(workflowVersions)
        .where(eq(workflowVersions.workflowId, currentWorkflowId))
        .orderBy(workflowVersions.version);
        
      if (versions.length > 0) {
        version = versions[versions.length - 1].version + 1;
      }
    }

    // Insert new version
    const [newVersion] = await db.insert(workflowVersions)
      .values({
        workflowId: currentWorkflowId,
        version,
        nodes,
        edges,
      })
      .returning();

    return NextResponse.json({ success: true, workflowId: currentWorkflowId, versionId: newVersion.id });
  } catch (error: any) {
    console.error('Save workflow error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
