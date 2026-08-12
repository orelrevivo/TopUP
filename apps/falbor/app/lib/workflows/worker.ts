import { db } from '~/lib/db';
import { workflowJobs, workflowExecutions, workflowExecutionLogs } from '~/lib/db/schema';
import { eq, lte, and } from 'drizzle-orm';
import { handleHttpRequest } from './handlers/http-request';
import { handleCodeExecute } from './handlers/code-execute';
import { handleDelay } from './handlers/delay';
import { parseObjectContext } from './context-parser';

export class WorkflowWorker {
  private isRunning = false;
  private pollIntervalMs = 5000;

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.poll();
  }

  stop() {
    this.isRunning = false;
  }

  private async poll() {
    if (!this.isRunning) return;

    try {
      await this.processNextJob();
    } catch (error) {
      console.error('Worker polling error:', error);
    } finally {
      setTimeout(() => this.poll(), this.pollIntervalMs);
    }
  }

  private async processNextJob() {
    // Find the next pending job that is ready to run
    const [job] = await db.select()
      .from(workflowJobs)
      .where(
        and(
          eq(workflowJobs.status, 'pending'),
          lte(workflowJobs.runAt, new Date())
        )
      )
      .limit(1);

    if (!job) return;

    // Mark as running
    await db.update(workflowJobs)
      .set({ status: 'running', updatedAt: new Date() })
      .where(eq(workflowJobs.id, job.id));

    try {
      const [execution] = await db.select()
        .from(workflowExecutions)
        .where(eq(workflowExecutions.id, job.executionId))
        .limit(1);

      if (!execution) throw new Error('Execution not found');

      // Log start
      const [logEntry] = await db.insert(workflowExecutionLogs)
        .values({
          executionId: job.executionId,
          stepId: job.stepId,
          status: 'pending',
          input: job.payload,
        })
        .returning();

      // Parse context variables
      const parsedPayload = parseObjectContext(job.payload, execution.context || {});
      const nodeType = parsedPayload.type;
      
      let output: any = {};

      switch (nodeType) {
        case 'http-request':
          output = await handleHttpRequest(parsedPayload);
          break;
        case 'code-execute':
          output = await handleCodeExecute(parsedPayload, execution.context || {});
          break;
        case 'delay':
          output = await handleDelay(parsedPayload, job.id);
          break;
        default:
          throw new Error(`Unsupported node type: ${nodeType}`);
      }

      // Update context
      const newContext = { ...(execution.context as any), [job.stepId]: output };
      await db.update(workflowExecutions)
        .set({ context: newContext })
        .where(eq(workflowExecutions.id, job.executionId));

      if (output && output.__delay) {
        // Special case: Delay node
        await db.update(workflowJobs)
          .set({ status: 'pending', runAt: output.runAt, updatedAt: new Date() })
          .where(eq(workflowJobs.id, job.id));
          
        await db.update(workflowExecutionLogs)
          .set({ status: 'success', output: { message: `Waiting until ${output.runAt}` }, completedAt: new Date() })
          .where(eq(workflowExecutionLogs.id, logEntry.id));
          
        return; // Don't complete the job normally
      }

      // Update log
      await db.update(workflowExecutionLogs)
        .set({ status: 'success', output, completedAt: new Date() })
        .where(eq(workflowExecutionLogs.id, logEntry.id));

      // Mark job as completed
      await db.update(workflowJobs)
        .set({ status: 'completed', updatedAt: new Date() })
        .where(eq(workflowJobs.id, job.id));

      // TODO: Queue the next step(s) based on workflow graph edges

    } catch (error: any) {
      console.error(`Job ${job.id} failed:`, error);
      
      // Mark job as failed
      await db.update(workflowJobs)
        .set({ 
          status: 'failed', 
          error: error.message,
          updatedAt: new Date() 
        })
        .where(eq(workflowJobs.id, job.id));
        
      // Update execution status
      await db.update(workflowExecutions)
        .set({ status: 'failed', errorLogs: error.message, completedAt: new Date() })
        .where(eq(workflowExecutions.id, job.executionId));
    }
  }
}

// Export a singleton
export const globalWorker = new WorkflowWorker();
