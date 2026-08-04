import { db } from './app/lib/db';
import { chatSnapshots } from './app/lib/db/schema';

async function run() {
  await db.delete(chatSnapshots);
  console.log("Snapshots cleared!");
}
run();
