CREATE TABLE IF NOT EXISTS "adr_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repository_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"severity" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "global_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"risky_path_keywords" text DEFAULT 'auth, billing, security, payment' NOT NULL,
	"large_pr_threshold" integer DEFAULT 15 NOT NULL,
	"missing_tests" boolean DEFAULT true NOT NULL,
	"dependency_change" boolean DEFAULT true NOT NULL,
	"report_format" text DEFAULT 'Markdown (GitHub Style)' NOT NULL,
	"include_low_risk" boolean DEFAULT false NOT NULL,
	"enable_post_to_github" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pr_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"repository_id" uuid NOT NULL,
	"pr_number" text NOT NULL,
	"title" text NOT NULL,
	"risk_level" text NOT NULL,
	"summary" text NOT NULL,
	"markdown_report" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repositories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"full_name" text NOT NULL,
	"github_id" text NOT NULL,
	"connected_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "adr_rules" ADD CONSTRAINT "adr_rules_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pr_reports" ADD CONSTRAINT "pr_reports_repository_id_repositories_id_fk" FOREIGN KEY ("repository_id") REFERENCES "public"."repositories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
