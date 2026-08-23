require('dotenv').config({ path: 'apps/falbor/.env' });
const { neon } = require('@neondatabase/serverless');

async function main() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const res = await sql`INSERT INTO users (id, email, username, display_name) VALUES ('test-123', 'test@example.com', 'testuser', 'Test') RETURNING *`;
    console.log(res);
  } catch(e) {
    console.error(e.message);
  }
}
main();
