CREATE TABLE IF NOT EXISTS "creator_connected_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"platform_user_id" text NOT NULL,
	"platform_username" text NOT NULL,
	"access_token_encrypted" text NOT NULL,
	"refresh_token_encrypted" text,
	"token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "creator_automation_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"auto_publish" boolean DEFAULT false NOT NULL,
	"manual_approval" boolean DEFAULT true NOT NULL,
	"max_clips_per_stream" integer DEFAULT 3 NOT NULL,
	"min_clip_score" integer DEFAULT 70 NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"caption_style" text DEFAULT 'modern_bold' NOT NULL,
	"upload_privacy" text DEFAULT 'unlisted' NOT NULL,
	"banned_topics" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "creator_automation_settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "creator_clips" (
	"id" text PRIMARY KEY NOT NULL,
	"stream_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"hook_text" text,
	"description" text,
	"hashtags" jsonb DEFAULT '[]'::jsonb,
	"start_time" integer NOT NULL,
	"end_time" integer NOT NULL,
	"score" integer NOT NULL,
	"content_type" text NOT NULL,
	"video_url" text,
	"thumbnail_url" text,
	"status" text DEFAULT 'generated' NOT NULL,
	"risk_flags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "creator_processing_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"stream_id" text NOT NULL,
	"level" text DEFAULT 'info' NOT NULL,
	"message" text NOT NULL,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "creator_streams" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"external_stream_id" text NOT NULL,
	"title" text,
	"status" text DEFAULT 'detected_live' NOT NULL,
	"vod_url" text,
	"duration_seconds" integer,
	"started_at" timestamp,
	"ended_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creator_connected_accounts" ADD CONSTRAINT "creator_connected_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creator_automation_settings" ADD CONSTRAINT "creator_automation_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creator_clips" ADD CONSTRAINT "creator_clips_stream_id_creator_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."creator_streams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creator_clips" ADD CONSTRAINT "creator_clips_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creator_processing_logs" ADD CONSTRAINT "creator_processing_logs_stream_id_creator_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."creator_streams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "creator_streams" ADD CONSTRAINT "creator_streams_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
