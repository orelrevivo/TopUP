import { NextResponse } from 'next/server';
import { db } from '~/lib/db';
import { workflowExecutions, workflowJobs, workflowVersions } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { workflowId, versionId, inputData } = await req.json();

    if (!workflowId || !versionId) {
      return NextResponse.json({ error: 'Missing workflowId or versionId' }, { status: 400 });
    }

    // Get the workflow version to find the trigger node
    const [version] = await db.select()
      .from(workflowVersions)
      .where(eq(workflowVersions.id, versionId))
      .limit(1);

    if (!version) {
      return NextResponse.json({ error: 'Workflow version not found' }, { status: 404 });
    }

    const nodes = version.nodes as any[];
    const edges = version.edges as any[];

    // Find the trigger node
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    if (!triggerNode) {
      return NextResponse.json({ error: 'Workflow has no trigger node' }, { status: 400 });
    }

    // Create execution record
    const [execution] = await db.insert(workflowExecutions)
      .values({
        workflowId,
        versionId,
        status: 'running',
        context: {
          trigger: inputData || {},
        }
      })
      .returning();

    // Find the next node connected to the trigger
    const initialEdges = edges.filter(e => e.source === triggerNode.id);
    
    if (initialEdges.length === 0) {
      // Nothing to do
      await db.update(workflowExecutions)
        .set({ status: 'completed', completedAt: new Date() })
        .where(eq(workflowExecutions.id, execution.id));
      return NextResponse.json({ success: true, executionId: execution.id, status: 'completed_empty' });
    }

    // Insert jobs for the next nodes
    for (const edge of initialEdges) {
      const targetNode = nodes.find(n => n.id === edge.target);
      if (targetNode) {
        await db.insert(workflowJobs)
          .values({
            workflowId,
            executionId: execution.id,
            stepId: targetNode.id,
            status: 'pending',
            payload: targetNode.data || {},
          });
      }
    }

    return NextResponse.json({ success: true, executionId: execution.id });
  } catch (error: any) {
    console.error('Workflow execution error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
