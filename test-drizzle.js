const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const schema = require('./apps/falbor/app/lib/db/schema');

console.log("Schema tables:");
console.log(Object.keys(schema).filter(k => k.includes('Relations')));

try {
  const sql = neon("postgresql://a:b@localhost:5432/c");
  const db = drizzle(sql, { schema });
  db.query.veFunnels.findMany({ with: { FunnelPages: true } });
  console.log("SUCCESS");
} catch (e) {
  console.log("ERROR TRACE:");
  console.log(e.stack);
}
