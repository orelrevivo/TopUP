require('dotenv').config({ path: 'apps/falbor/.env' });
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const res = await sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE column_name IN ('id', 'chat_id') AND table_schema = 'public'
    `;
    console.log(JSON.stringify(res, null, 2));
  } catch(e) {
    console.error(e.message);
  }
}
main();
