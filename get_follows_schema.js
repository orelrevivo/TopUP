const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: 'apps/falbor/.env' });

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  
  const result = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'follows'`;
  console.log(result);
  process.exit(0);
}
main().catch(console.error);
