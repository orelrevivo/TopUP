const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: 'apps/falbor/.env' });

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  
  const result = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'files'`;
  console.log(result);
  
  const count = await sql`SELECT COUNT(*) FROM files`;
  console.log('Count:', count[0].count);
  process.exit(0);
}
main().catch(console.error);
