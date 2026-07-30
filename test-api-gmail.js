const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT id, name, config, created_at, updated_at FROM mcp_connections WHERE connector_id = 'gmail' OR connector_id = 'stripe' ORDER BY created_at DESC`;
  console.log(JSON.stringify(res, null, 2));
}
run();
