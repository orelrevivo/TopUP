import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Neon DB. Applying non-destructive creator migration...");

  await client.query(`
    CREATE TABLE IF NOT EXISTS creator_connected_accounts (
      id text PRIMARY KEY NOT NULL,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform text NOT NULL,
      platform_user_id text NOT NULL,
      platform_username text NOT NULL,
      access_token_encrypted text NOT NULL,
      refresh_token_encrypted text,
      token_expires_at timestamp,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS creator_automation_settings (
      id text PRIMARY KEY NOT NULL,
      user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      auto_publish boolean DEFAULT false NOT NULL,
      manual_approval boolean DEFAULT true NOT NULL,
      max_clips_per_stream integer DEFAULT 3 NOT NULL,
      min_clip_score integer DEFAULT 70 NOT NULL,
      language text DEFAULT 'en' NOT NULL,
      caption_style text DEFAULT 'modern_bold',
      upload_privacy text DEFAULT 'unlisted' NOT NULL,
      banned_topics jsonb DEFAULT '[]'::jsonb,
      source_type text DEFAULT 'own' NOT NULL,
      target_channel_url text,
      created_at timestamp DEFAULT now() NOT NULL,
      updated_at timestamp DEFAULT now() NOT NULL
    );

    ALTER TABLE creator_automation_settings ADD COLUMN IF NOT EXISTS source_type text DEFAULT 'own' NOT NULL;
    ALTER TABLE creator_automation_settings ADD COLUMN IF NOT EXISTS target_channel_url text;

    CREATE TABLE IF NOT EXISTS creator_streams (
      id text PRIMARY KEY NOT NULL,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform text NOT NULL,
      external_stream_id text NOT NULL,
      title text,
      status text DEFAULT 'detected_live' NOT NULL,
      vod_url text,
      duration_seconds integer,
      started_at timestamp,
      ended_at timestamp,
      created_at timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS creator_clips (
      id text PRIMARY KEY NOT NULL,
      stream_id text NOT NULL REFERENCES creator_streams(id) ON DELETE CASCADE,
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title text NOT NULL,
      hook_text text,
      description text,
      hashtags jsonb DEFAULT '[]'::jsonb,
      start_time integer NOT NULL,
      end_time integer NOT NULL,
      score integer NOT NULL,
      content_type text NOT NULL,
      video_url text,
      thumbnail_url text,
      status text DEFAULT 'generated' NOT NULL,
      risk_flags jsonb DEFAULT '[]'::jsonb,
      created_at timestamp DEFAULT now() NOT NULL
    );

    CREATE TABLE IF NOT EXISTS creator_processing_logs (
      id text PRIMARY KEY NOT NULL,
      stream_id text NOT NULL REFERENCES creator_streams(id) ON DELETE CASCADE,
      level text DEFAULT 'info' NOT NULL,
      message text NOT NULL,
      meta jsonb,
      created_at timestamp DEFAULT now() NOT NULL
    );
  `);

  console.log("Migration executed successfully! 5 creator_ tables created.");
  await client.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
