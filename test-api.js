const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT config FROM mcp_connections WHERE connector_id = 'slack' ORDER BY created_at DESC LIMIT 1`;
  console.log("Type of config:", typeof res[0].config);
  console.log("Is config string?", typeof res[0].config === 'string');
}
run();
