import { App } from 'octokit';

export function getGitHubApp() {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const webhooksSecret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!appId || !privateKey || !webhooksSecret) {
    throw new Error('GitHub App environment variables (GITHUB_APP_ID, GITHUB_PRIVATE_KEY, GITHUB_WEBHOOK_SECRET) are missing.');
  }

  return new App({
    appId,
    privateKey,
    webhooks: {
      secret: webhooksSecret,
    },
  });
}

export async function getInstallationOctokit(installationId: string | number) {
  const app = getGitHubApp();
  return await app.getInstallationOctokit(Number(installationId));
}
