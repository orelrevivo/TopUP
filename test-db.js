import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const result = await sql`SELECT content FROM messages WHERE role = 'assistant' ORDER BY created_at ASC LIMIT 1`;
  console.log(result[0].content);
}
run();
