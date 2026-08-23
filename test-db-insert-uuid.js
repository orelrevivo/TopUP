require('dotenv').config({ path: 'apps/falbor/.env' });
const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const id = crypto.randomUUID();
    const res = await sql`INSERT INTO users (id, email, username, display_name) VALUES (${id}, 'test2@example.com', 'testuser2', 'Test') RETURNING *`;
    console.log(res);
  } catch(e) {
    console.error(e.message);
  }
}
main();
