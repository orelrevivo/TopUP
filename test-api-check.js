const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const res = await sql`SELECT id, name, config FROM mcp_connections WHERE id = '141bb489-5131-41e9-9495-f87995087e78'`;
  console.log(JSON.stringify(res, null, 2));
}
run();
