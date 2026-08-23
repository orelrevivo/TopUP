require('dotenv').config({ path: 'apps/falbor/.env' });
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const res = await sql`SELECT * FROM users`;
    console.log(res);
  } catch(e) {
    console.error(e.message);
  }
}
main();
