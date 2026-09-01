import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

async function run() {
  console.log("Creating tables...");

  await sql`
    CREATE TABLE IF NOT EXISTS repositories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      full_name TEXT NOT NULL,
      github_id TEXT NOT NULL,
      connected_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS adr_rules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      repository_id UUID NOT NULL REFERENCES repositories(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pr_reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      repository_id UUID NOT NULL REFERENCES repositories(id),
      pr_number TEXT NOT NULL,
      title TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      summary TEXT NOT NULL,
      markdown_report TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  console.log("Tables created successfully!");
}

run().catch(console.error);
