'use server';

import { db } from '@/db';
import { repositories, globalSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { 
  fetchAppRepositories, 
  fetchAppPullRequests, 
  fetchAppPullRequestFiles, 
  createPullRequestComment 
} from '@/lib/github/client';
import { getInstallationOctokit } from '@/lib/github/app';

export async function getGitHubAppInstallationId() {
  const existing = await db.select().from(globalSettings).where(eq(globalSettings.id, 1));
  return existing[0]?.githubAppInstallationId;
}

export async function getGitHubToken() {
  return cookies().get('github_token')?.value;
}

export async function isGitHubConnected() {
  const token = await getGitHubToken();
  const installId = await getGitHubAppInstallationId();
  return !!token || !!installId;
}

export async function saveGitHubToken(token: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Invalid GitHub token. Please verify your Personal Access Token.');
  }

  cookies().set('github_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });

  revalidatePath('/dashboard/repositories');
  revalidatePath('/dashboard/settings');
}

export async function disconnectGitHub() {
  cookies().delete('github_token');
  await db.update(globalSettings).set({ githubAppInstallationId: null }).where(eq(globalSettings.id, 1));
  revalidatePath('/dashboard/repositories');
  revalidatePath('/dashboard/settings');
}

export async function validateGitHubPermissions() {
  const token = await getGitHubToken();
  if (!token) return { connected: false, permissions: [], username: null };

  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return { connected: true, valid: false, permissions: [], username: null };
    }

    const data = await response.json();
    const scopesHeader = response.headers.get('x-oauth-scopes') || '';
    const scopes = scopesHeader.split(',').map(s => s.trim());

    return { 
      connected: true, 
      valid: true,
      permissions: scopes, 
      username: data.login 
    };
  } catch (error) {
    return { connected: true, valid: false, permissions: [], username: null };
  }
}

export async function fetchGitHubRepositories() {
  const installId = await getGitHubAppInstallationId();
  if (installId) {
    return await fetchAppRepositories(installId);
  }

  const token = await getGitHubToken();
  if (!token) {
    throw new Error("Connect GitHub token or App to fetch repositories.");
  }

  const response = await fetch('https://api.github.com/user/repos?per_page=50&sort=updated', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories from GitHub: ${response.statusText}`);
  }

  const data = await response.json();
  return data.map((repo: any) => ({
    id: repo.id.toString(),
    name: repo.name,
    fullName: repo.full_name,
    private: repo.private,
    defaultBranch: repo.default_branch,
    url: repo.html_url
  }));
}

export async function fetchRealPRs(repoFullName: string) {
  const installId = await getGitHubAppInstallationId();
  if (installId) {
    return await fetchAppPullRequests(installId, repoFullName);
  }

  const token = await getGitHubToken();
  if (!token) {
    throw new Error("Connect GitHub token to fetch pull requests.");
  }

  const response = await fetch(`https://api.github.com/repos/${repoFullName}/pulls?state=open&per_page=10`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch PRs from GitHub: ${response.statusText}`);
  }

  const data = await response.json();
  return data.map((pr: any) => ({
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

export async function fetchPRDiff(diffUrl: string) {
  const token = await getGitHubToken();
  // For GitHub App, diff fetching via URL might require auth headers if private, 
  // but if we don't have token, we can use octokit with the URL
  // To keep it simple, we use getInstallationOctokit directly for the diff fetch if needed.
  // Actually PR diff can be fetched via octokit using headers: { accept: "application/vnd.github.v3.diff" }
  const installId = await getGitHubAppInstallationId();

  let authHeader = '';
  if (token) {
    authHeader = `Bearer ${token}`;
  } else if (installId) {
    const appOctokit = await getInstallationOctokit(installId);
    const { token: appToken } = await appOctokit.auth({ type: "installation" }) as any;
    authHeader = `Bearer ${appToken}`;
  } else {
    throw new Error("Not authenticated");
  }

  const response = await fetch(diffUrl, {
    headers: {
      Authorization: authHeader,
      Accept: 'application/vnd.github.v3.diff',
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch diff");
  }
  return await response.text();
}

export async function connectRepository(githubId: string, name: string, fullName: string) {
  const existing = await db.select().from(repositories).where(eq(repositories.githubId, githubId));
  if (existing.length > 0) {
    return existing[0];
  }

  const inserted = await db.insert(repositories).values({
    name,
    fullName,
    githubId,
  }).returning();

  revalidatePath('/dashboard/repositories');
  return inserted[0];
}

export async function getConnectedRepositories() {
  return await db.select().from(repositories);
}

export async function getPullRequestFiles(repoFullName: string, pullNumber: string) {
  const installId = await getGitHubAppInstallationId();
  if (installId) {
    return await fetchAppPullRequestFiles(installId, repoFullName, Number(pullNumber));
  }

  const token = await getGitHubToken();
  if (!token) throw new Error("Connect GitHub token to fetch pull request files.");

  const response = await fetch(`https://api.github.com/repos/${repoFullName}/pulls/${pullNumber}/files?per_page=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch PR files: ${response.statusText}`);
  }

  const data = await response.json();
  return data.map((file: any) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    patch: file.patch || '',
  }));
}

export async function postPullRequestComment(repoFullName: string, pullNumber: string, body: string) {
  const installId = await getGitHubAppInstallationId();
  if (installId) {
    await createPullRequestComment(installId, repoFullName, Number(pullNumber), body);
    return { success: true };
  }

  const token = await getGitHubToken();
  if (!token) throw new Error("Connect GitHub token to post comments.");

  const response = await fetch(`https://api.github.com/repos/${repoFullName}/issues/${pullNumber}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body }),
  });

  if (!response.ok) {
    throw new Error(`Failed to post comment to GitHub: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchRepositoryDetails(repoFullName: string) {
  const installId = await getGitHubAppInstallationId();
  let authHeader = '';
  
  if (installId) {
    const appOctokit = await getInstallationOctokit(installId);
    const { token: appToken } = await appOctokit.auth({ type: "installation" }) as any;
    authHeader = `Bearer ${appToken}`;
  } else {
    const token = await getGitHubToken();
    if (!token) throw new Error("Not authenticated");
    authHeader = `Bearer ${token}`;
  }

  const response = await fetch(`https://api.github.com/repos/${repoFullName}`, {
    headers: {
      Authorization: authHeader,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repository details: ${response.statusText}`);
  }

  return await response.json();
}
