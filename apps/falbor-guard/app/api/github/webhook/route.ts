import { NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/github/webhooks';
import { db } from '@/db';
import { globalSettings, repositories, adrRules, prReports } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { fetchAppPullRequestDetails, createPullRequestComment, createCheckRun, updateCheckRun } from '@/lib/github/client';
import { analyzePR } from '@/lib/github/analyzer';
import { getInstallationOctokit } from '@/lib/github/app';

export async function POST(request: Request) {
  const signature = request.headers.get('x-hub-signature-256');
  const event = request.headers.get('x-github-event');
  
  if (!signature || !event) {
    return new NextResponse('Missing signature or event', { status: 400 });
  }

  const payloadText = await request.text();
  
  // Verify webhook payload
  try {
    const isValid = await verifyWebhookSignature(payloadText, signature);
    if (!isValid) {
      return new NextResponse('Invalid signature', { status: 401 });
    }
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new NextResponse('Verification failed', { status: 500 });
  }

  const payload = JSON.parse(payloadText);

  // We only care about pull_request events
  if (event === 'pull_request') {
    const action = payload.action;
    // We want to run analysis on opened, synchronize (new commits), or reopened
    if (['opened', 'synchronize', 'reopened'].includes(action)) {
      
      const prNumber = payload.pull_request.number;
      const repoFullName = payload.repository.full_name;
      const githubRepoId = payload.repository.id.toString();
      const installationId = payload.installation?.id?.toString();
      const headSha = payload.pull_request.head.sha;

      if (!installationId) {
        return new NextResponse('No installation ID found', { status: 400 });
      }

      // Check if this repository is registered in our database
      const connectedRepos = await db.select().from(repositories).where(eq(repositories.githubId, githubRepoId));
      if (connectedRepos.length === 0) {
        return new NextResponse('Repository not connected in Falbor Guard', { status: 200 });
      }
      
      const repoDb = connectedRepos[0];

      // Fetch global settings and rules
      const settingsResult = await db.select().from(globalSettings).where(eq(globalSettings.id, 1));
      const settings = settingsResult[0];
      const rulesResult = await db.select().from(adrRules).where(eq(adrRules.repositoryId, repoDb.id));

      // Create initial Check Run as "in_progress"
      let checkRunId: number | null = null;
      try {
        checkRunId = await createCheckRun(
          installationId,
          repoFullName,
          headSha,
          'Falbor Guard Analysis',
          'in_progress'
        );
      } catch (err) {
        console.error("Failed to create check run:", err);
      }

      try {
        // Fetch PR files/diff via octokit manually (to get the raw diff string)
        const appOctokit = await getInstallationOctokit(installationId);
        const diffResponse = await appOctokit.request(`GET /repos/${repoFullName}/pulls/${prNumber}`, {
          headers: {
            Accept: 'application/vnd.github.v3.diff'
          }
        });
        const diffText = diffResponse.data as unknown as string;

        // Fetch changed files names
        const filesResponse = await appOctokit.request(`GET /repos/${repoFullName}/pulls/${prNumber}/files`, { per_page: 100 });
        const changedFiles = filesResponse.data.map((f: any) => f.filename).join('\n');

        // Prepare Rules String
        let rulesText = 'No specific ADR rules defined.';
        if (rulesResult.length > 0) {
          rulesText = rulesResult.map(r => `- **${r.title}** (${r.severity} Risk): ${r.description}`).join('\n');
        }

        // Run Analysis
        const report = await analyzePR({
          title: payload.pull_request.title,
          description: payload.pull_request.body || '',
          changedFiles,
          diffText,
          rules: rulesText,
        });

        // Save report to DB
        await db.insert(prReports).values({
          repositoryId: repoDb.id,
          prNumber: prNumber.toString(),
          title: payload.pull_request.title,
          riskLevel: report.riskLevel,
          summary: report.summary,
          markdownReport: report.markdownReport,
        });

        // Post a comment to the PR if enabled in global settings (default true)
        if (settings?.enablePostToGitHub !== false) {
          await createPullRequestComment(installationId, repoFullName, prNumber, report.markdownReport);
        }

        // Update Check Run based on Risk Level
        if (checkRunId) {
          const conclusion = report.riskLevel === 'High' ? 'failure' : (report.riskLevel === 'Medium' ? 'neutral' : 'success');
          await updateCheckRun(installationId, repoFullName, checkRunId, conclusion, {
            title: `${report.riskLevel} Risk Detected`,
            summary: report.summary,
            text: report.markdownReport,
          });
        }

      } catch (error) {
        console.error("Webhook processing error:", error);
        
        if (checkRunId) {
          await updateCheckRun(installationId, repoFullName, checkRunId, 'failure', {
            title: 'Analysis Failed',
            summary: 'An error occurred during Falbor Guard analysis.',
          });
        }
        return new NextResponse('Internal server error during analysis', { status: 500 });
      }
    }
  }

  return new NextResponse('OK', { status: 200 });
}
