import { db } from '~/lib/db';
import { workflowJobs } from '~/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function handleDelay(nodeData: any, jobId: string) {
  const { delayMs } = nodeData;
  if (!delayMs || typeof delayMs !== 'number') {
    throw new Error('Delay node requires delayMs');
  }

  const runAt = new Date(Date.now() + delayMs);

  // Instead of blocking, we update the job's runAt and set it back to pending
  // We throw a special error or return a specific status to let the worker know
  return { __delay: true, runAt };
}
