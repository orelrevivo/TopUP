const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT name, config FROM mcp_connections WHERE connector_id = 'slack' ORDER BY created_at DESC LIMIT 1`;
  console.log(JSON.stringify(res, null, 2));
}
run();
