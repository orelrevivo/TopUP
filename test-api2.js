const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { mcpConnections } = require('./app/lib/db/schema');
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function run() {
  const connections = await db.select().from(mcpConnections);
  console.log("Is config string?", typeof connections[0].config === 'string');
  console.log("Config keys:", Object.keys(connections[0].config || {}));
}
run();
