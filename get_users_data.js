const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: 'apps/falbor/.env' });
async function main() {
  const sql = neon(process.env.DATABASE_URL);
  const result = await sql`SELECT id FROM users LIMIT 5`;
  console.log(result);
  process.exit(0);
}
main().catch(console.error);
