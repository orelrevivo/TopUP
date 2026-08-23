require('dotenv').config({ path: 'apps/falbor/.env' });
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const res = await sql`SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'name'`;
    console.log(res);
  } catch(e) {
    console.error(e);
  }
}
main();
