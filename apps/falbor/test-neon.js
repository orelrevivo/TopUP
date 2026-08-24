const { neon } = require('@neondatabase/serverless');

async function runQuery(databaseUrl, query) {
  const sql = neon(databaseUrl);
  const rows = await sql([query]);
  return { rows, fields: null };
}

async function test() {
  const url = '';
  try {
    const res = await runQuery(url, "SELECT schemaname, tablename FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema') ORDER BY schemaname, tablename;");
    console.log("SUCCESS:");
    console.log(res);
  } catch (e) {
    console.log("ERROR:");
    console.log(e);
  }
}
test();
