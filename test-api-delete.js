const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT id, user_id FROM mcp_connections WHERE connector_id = 'slack'`;
  console.log(res);
}
run();
