require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function run() {
  const sql = neon(process.env.DATABASE_URL);
  const sqlContent = fs.readFileSync(path.join(__dirname, 'drizzle/0001_big_arclight.sql'), 'utf-8');
  
  const statements = sqlContent.split('--> statement-breakpoint').map(s => s.trim()).filter(s => s.length > 0);
  
  for (const statement of statements) {
    console.log('Running:', statement.slice(0, 50) + '...');
    try {
      await sql(statement);
      console.log('Success');
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}

run().catch(console.error);
