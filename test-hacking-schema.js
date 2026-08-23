require('dotenv').config({ path: 'apps/falbor/.env' });
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const res = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'hacking_chats'`;
    console.log(res);
  } catch(e) {
    console.error(e.message);
  }
}
main();
