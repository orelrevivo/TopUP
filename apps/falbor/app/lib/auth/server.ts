import { cookies, headers } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '~/lib/auth';

export async function getCurrentUserId() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value || headers().get("x-session-token");
  if (token) {
    const payload = await verifyToken(token);
    return payload?.userId || null;
  }
  return null;
}
