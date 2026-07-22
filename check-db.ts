import { db } from './app/lib/db/index.js';
import { deployments, chats } from './app/lib/db/schema.js';

async function check() {
  const d = await db.select().from(deployments);
  console.log('Deployments:', d);
  const c = await db.select().from(chats).limit(5);
  console.log('Chats (first 5):', c);
}

check().catch(console.error).finally(() => process.exit(0));
