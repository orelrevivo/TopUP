import { pgTable, serial, text, timestamp, boolean, uuid, integer } from "drizzle-orm/pg-core";

export const repositories = pgTable("repositories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  githubId: text("github_id").notNull(),
  connectedAt: timestamp("connected_at").defaultNow().notNull(),
});

export const adrRules = pgTable("adr_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  repositoryId: uuid("repository_id").references(() => repositories.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // 'High', 'Medium', 'Low'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prReports = pgTable("pr_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  repositoryId: uuid("repository_id").references(() => repositories.id).notNull(),
  prNumber: text("pr_number").notNull(),
  title: text("title").notNull(),
  riskLevel: text("risk_level").notNull(), // 'High', 'Medium', 'Low'
  summary: text("summary").notNull(),
  markdownReport: text("markdown_report").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const globalSettings = pgTable("global_settings", {
  id: serial("id").primaryKey(),
  riskyPathKeywords: text("risky_path_keywords").default('auth, billing, security, payment').notNull(),
  largePrThreshold: integer("large_pr_threshold").default(15).notNull(),
  missingTests: boolean("missing_tests").default(true).notNull(),
  dependencyChange: boolean("dependency_change").default(true).notNull(),
  reportFormat: text("report_format").default('Markdown (GitHub Style)').notNull(),
  includeLowRisk: boolean("include_low_risk").default(false).notNull(),
  enablePostToGitHub: boolean("enable_post_to_github").default(true).notNull(),
  githubAppInstallationId: text("github_app_installation_id"),
});
