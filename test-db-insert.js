require('dotenv').config({ path: 'apps/falbor/.env' });
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const res = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'users'`;
    console.log(res.map(r => r.column_name));
  } catch(e) {
    console.error(e);
  }
}
main();
