const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: 'apps/falbor/.env' });
async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const count = await sql`SELECT COUNT(*) FROM follows`;
  console.log(count);
  process.exit(0);
}
main().catch(console.error);
