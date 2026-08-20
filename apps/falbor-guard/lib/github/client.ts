import { getInstallationOctokit } from './app';

export async function fetchAppRepositories(installationId: string) {
  const octokit = await getInstallationOctokit(installationId);
  const response = await octokit.request('GET /installation/repositories', {
    per_page: 100,
  });
  
  return response.data.repositories.map((repo: any) => ({
    id: repo.id.toString(),
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    defaultBranch: repo.default_branch,
    url: repo.html_url
  }));
}

export async function fetchAppPullRequests(installationId: string, repoFullName: string) {
  const octokit = await getInstallationOctokit(installationId);
  const response = await octokit.request(`GET /repos/${repoFullName}/pulls`, {
    state: 'open',
    per_page: 50,
  });

  return response.data.map((pr: any) => ({
    id: pr.id.toString(),
    number: pr.number.toString(),
    title: pr.title,
    author: pr.user.login,
    diffUrl: pr.diff_url,
    branch: pr.head.ref,
    status: pr.state,
    url: pr.html_url
  }));
}

export async function fetchAppPullRequestFiles(installationId: string, repoFullName: string, pullNumber: number) {
  const octokit = await getInstallationOctokit(installationId);
  const response = await octokit.request(`GET /repos/${repoFullName}/pulls/${pullNumber}/files`, {
    per_page: 100,
  });

  return response.data.map((file: any) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    patch: file.patch || '',
  }));
}

export async function fetchAppPullRequestDetails(installationId: string, repoFullName: string, pullNumber: number) {
  const octokit = await getInstallationOctokit(installationId);
  const response = await octokit.request(`GET /repos/${repoFullName}/pulls/${pullNumber}`);
  return response.data;
}

export async function createPullRequestComment(installationId: string, repoFullName: string, pullNumber: number, body: string) {
  const octokit = await getInstallationOctokit(installationId);
  await octokit.request(`POST /repos/${repoFullName}/issues/${pullNumber}/comments`, {
    body,
  });
}

export async function createCheckRun(
  installationId: string, 
  repoFullName: string, 
  headSha: string, 
  name: string, 
  status: 'queued' | 'in_progress' | 'completed',
  conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required',
  output?: { title: string; summary: string; text?: string }
) {
  const octokit = await getInstallationOctokit(installationId);
  const [owner, repo] = repoFullName.split('/');
  
  const response = await octokit.request(`POST /repos/${owner}/${repo}/check-runs`, {
    name,
    head_sha: headSha,
    status,
    conclusion,
    output,
  });
  
  return response.data.id;
}

export async function updateCheckRun(
  installationId: string,
  repoFullName: string,
  checkRunId: number,
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'timed_out' | 'action_required',
  output: { title: string; summary: string; text?: string }
) {
  const octokit = await getInstallationOctokit(installationId);
  const [owner, repo] = repoFullName.split('/');
  
  await octokit.request(`PATCH /repos/${owner}/${repo}/check-runs/${checkRunId}`, {
    status: 'completed',
    conclusion,
    output,
  });
}
