import { Webhooks } from '@octokit/webhooks';

let webhooks: Webhooks;

export function getWebhooksHandler() {
  if (webhooks) return webhooks;

  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('GITHUB_WEBHOOK_SECRET is missing');
  }

  webhooks = new Webhooks({
    secret,
  });

  return webhooks;
}

export async function verifyWebhookSignature(payload: string, signature: string) {
  const handler = getWebhooksHandler();
  return await handler.verify(payload, signature);
}
