import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, jsonb, boolean, integer, decimal, serial } from "drizzle-orm/pg-core";

// Re-export types so `import { Agency } from '~/lib/db/schema'` keeps working.
// The actual type definitions are in types.ts (safe for client components).
export type {
  User, Agency, SubAccount, Permission, Tag, Pipeline, Lane, Ticket,
  Trigger, Automation, Action, Funnel, FunnelPage, FunnelProduct,
  NewUser, NewAgency, NewSubAccount, NewFunnel, NewFunnelPage,
  AgencyWithSubAccounts, UserWithAgency, FunnelWithPages, LaneWithTickets, PipelineWithLanes,
  Plan, AgencySidebarOption, Contact,
  Prisma,
} from './types'

export { ActionType, TriggerTypes } from './types'

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").unique(),
  passwordHash: text("password_hash"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  coverUrl: text("cover_url"),
  timezone: text("timezone"),
  displayEmail: boolean("display_email").default(false).notNull(),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  customLinks: jsonb("custom_links").default("[]"),
  location: text("location"),
  statusMessage: text("status_message"),
  skills: jsonb("skills").default("[]"),
  badges: jsonb("badges").default("[]"),
  stats: jsonb("stats").default("{}"),
  profileApps: jsonb("profile_apps").default("[]"),
  balance: integer("balance").default(600).notNull(),
  subscriptionTier: text("subscription_tier").default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  isVerified: boolean("is_verified").default(true).notNull(),
  verificationCode: text("verification_code"),
  role: text("role").default("SUBACCOUNT_USER"),
  agencyId: uuid("agency_id"), // Will reference ve_agencies.id
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const follows = pgTable("follows", {
  id: uuid("id").defaultRandom().primaryKey(),
  followerId: uuid("follower_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: uuid("following_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  orderId: text("order_id").notNull(),
  amount: integer("amount").notNull(),
  tier: text("tier"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memories = pgTable("memories", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const providerSettings = pgTable("provider_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerName: text("provider_name").notNull(),
  settings: jsonb("settings").default("{}"),
  enabled: boolean("enabled").default(false),
  apiKey: text("api_key"),
  baseUrl: text("base_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const browserSessions = pgTable("browser_sessions", {
  id: text("id").primaryKey(), // browserbase session id
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const cronRuns = pgTable("cron_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  cronName: text("cron_name").notNull(),
  runDate: text("run_date").notNull().unique(), // e.g. "2026-08-25" to enforce once per day
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

export const templates = pgTable("templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description"),
  mainImage: text("main_image"),
  images: jsonb("images").default("[]"),
  url: text("url"),
  chatId: text("chat_id"),
  categories: jsonb("categories").default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const templateReviews = pgTable("template_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  templateId: uuid("template_id").notNull().references(() => templates.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  content: text("content"),
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const serviceConnections = pgTable("service_connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  service: text("service").notNull(),
  token: text("token"),
  tokenType: text("token_type"),
  username: text("username"),
  stats: jsonb("stats").default("{}"),
  settings: jsonb("settings").default("{}"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mcpSettings = pgTable("mcp_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  config: jsonb("config").default("{}"),
  maxLLMSteps: integer("max_llm_steps").default(15),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").default("New Chat"),
  description: text("description"),
  isPublic: boolean("is_public").default(false).notNull(),
  model: text("model"),
  provider: text("provider"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const feedbacks = pgTable("feedbacks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: jsonb("content").notNull(),
  rating: integer("rating").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const deployments = pgTable("deployments", {
  chatId: text("chat_id").primaryKey().references(() => chats.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  provider: text("provider").notNull(),
  subdomain: text("subdomain"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content"),
  toolInvocations: jsonb("tool_invocations"),
  imageData: text("image_data"),
  parts: jsonb("parts").default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSnapshots = pgTable("chat_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: text("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  files: jsonb("files").default("{}"),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  chatId: text("chat_id").references(() => chats.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  deploymentConfig: jsonb("deployment_config").default("{}"),
  repoInfo: jsonb("repo_info").default("{}"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tabConfigurations = pgTable("tab_configurations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  config: jsonb("config").default("{}"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const eventLogs = pgTable("event_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  category: text("category"),
  message: text("message").notNull(),
  details: jsonb("details").default("{}"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gitCredentials = pgTable("git_credentials", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  domain: text("domain").notNull(),
  username: text("username"),
  token: text("token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const neonDatabases = pgTable("neon_databases", {
  chatId: text("chat_id").primaryKey(),
  databaseUrl: text("database_url").notNull(),
  projectId: text("project_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supabaseDatabases = pgTable("supabase_databases", {
  chatId: text("chat_id").primaryKey(),
  supabaseUrl: text("supabase_url").notNull(),
  supabaseAnonKey: text("supabase_anon_key").notNull(),
  projectId: text("project_id").notNull(),
  databasePassword: text("database_password").notNull(),
  databaseUrl: text("database_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const generatedImages = pgTable("generated_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  prompt: text("prompt").notNull(),
  imageUrl: text("image_url").notNull(), // We'll store the base64 or URL string here
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatImages = pgTable("chat_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: text("chat_id").notNull().references(() => chats.id, { onDelete: "cascade" }),
  filePath: text("file_path").notNull(),
  base64Data: text("base64_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Hacking Section Tables ──────────────────────────────────────────────────
// Mirrors chats / messages / chatSnapshots but stored in separate tables
// so hacking history is completely isolated from the main website-builder chat.

export const hackingChats = pgTable("hacking_chats", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").default("New Hacking Chat"),
  description: text("description"),
  model: text("model"),
  provider: text("provider"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const hackingMessages = pgTable("hacking_messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id").notNull().references(() => hackingChats.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content"),
  parts: jsonb("parts").default("[]"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hackingChatSnapshots = pgTable("hacking_chat_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: text("chat_id").notNull().references(() => hackingChats.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  files: jsonb("files").default("{}"),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Stores screenshots taken by the AI browser agent in Neon.
// Using text (base64) so no filesystem is needed — works in any deployment.
export const hackingScreenshots = pgTable("hacking_screenshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  imageData: text("image_data").notNull(),  // base64-encoded PNG
  sourceUrl: text("source_url"),            // the URL that was screenshotted
  mimeType: text("mime_type").default("image/png").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Workflow Automation Tables ──────────────────────────────────────────────

export const workflows = pgTable("workflows", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  chatId: text("chat_id").references(() => chats.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("draft").notNull(), // draft, published, archived
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workflowVersions = pgTable("workflow_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: uuid("workflow_id").notNull().references(() => workflows.id, { onDelete: "cascade" }),
  version: integer("version").notNull(),
  nodes: jsonb("nodes").default("[]").notNull(),
  edges: jsonb("edges").default("[]").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const workflowExecutions = pgTable("workflow_executions", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: uuid("workflow_id").notNull().references(() => workflows.id, { onDelete: "cascade" }),
  versionId: uuid("version_id").notNull().references(() => workflowVersions.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // pending, running, paused, completed, failed
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  errorLogs: text("error_logs"),
  context: jsonb("context").default("{}"),
  creditsUsed: integer("credits_used").default(0),
});

export const workflowExecutionLogs = pgTable("workflow_execution_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  executionId: uuid("execution_id").notNull().references(() => workflowExecutions.id, { onDelete: "cascade" }),
  stepId: text("step_id").notNull(),
  status: text("status").notNull(), // pending, success, failed
  input: jsonb("input"),
  output: jsonb("output"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const workflowJobs = pgTable("workflow_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: uuid("workflow_id").notNull().references(() => workflows.id, { onDelete: "cascade" }),
  executionId: uuid("execution_id").notNull().references(() => workflowExecutions.id, { onDelete: "cascade" }),
  stepId: text("step_id").notNull(),
  status: text("status").default("pending").notNull(), // pending, running, completed, failed
  runAt: timestamp("run_at").defaultNow().notNull(),
  retries: integer("retries").default(0).notNull(),
  payload: jsonb("payload"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const falborSiteFiles = pgTable("falbor_site_files", {
  id: uuid("id").defaultRandom().primaryKey(),
  subdomain: text("subdomain").notNull().unique(),
  chatId: text("chat_id").notNull(),
  files: jsonb("files").notNull().default("{}"), // { "/index.html": "...", "/style.css": "..." }
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mcpConnections = pgTable("mcp_connections", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  connectorId: text("connector_id").notNull(),
  name: text("name").notNull(),
  config: jsonb("config").default("{}"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Analyzed Reports (Validation Pages) ────────────────────────────────────

export const analyzedReports = pgTable("analyzed_reports", {
  id: text("id").primaryKey(), // We can use short IDs for shareable links, e.g. "abc123"
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  chatId: text("chat_id").references(() => chats.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  problem: text("problem"),
  targetAudience: text("target_audience"),
  isPublic: boolean("is_public").default(false).notNull(),
  rawAnalysis: text("raw_analysis"),
  rawResources: text("raw_resources"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const analyzedFeedbacks = pgTable("analyzed_feedbacks", {
  id: uuid("id").defaultRandom().primaryKey(),
  reportId: text("report_id").notNull().references(() => analyzedReports.id, { onDelete: "cascade" }),
  wouldUse: boolean("would_use").notNull(),
  feedbackText: text("feedback_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sourcesInvestigations = pgTable("sources_investigations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  query: text("query").notNull(),
  state: jsonb("state").default("{}").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── StayUp SDK Tables ────────────────────────────────────────────────────────

export const stayupProjects = pgTable("stayup_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  apiKey: text("api_key").notNull().unique(),
  allowedOrigins: jsonb("allowed_origins").default("[]"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stayupIssues = pgTable("stayup_issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => stayupProjects.id, { onDelete: "cascade" }),
  fingerprint: text("fingerprint").notNull(),
  status: text("status").default("unresolved").notNull(), // unresolved, resolved, ignored
  severity: text("severity").default("error").notNull(), // debug, info, warning, error, critical
  title: text("title").notNull(),
  message: text("message"),
  environment: text("environment").default("production"),
  eventCount: integer("event_count").default(0).notNull(),
  firstSeen: timestamp("first_seen").defaultNow().notNull(),
  lastSeen: timestamp("last_seen").defaultNow().notNull(),
  aiAnalysis: jsonb("ai_analysis"), // Stores: explanation, rootCause, affectedComponent, evidence, recommendedFix, stepByStepInstructions, confidenceLevel, aiPrompt
  aiAnalyzedAt: timestamp("ai_analyzed_at"),
});

export const stayupEvents = pgTable("stayup_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  issueId: uuid("issue_id").notNull().references(() => stayupIssues.id, { onDelete: "cascade" }),
  projectId: uuid("project_id").notNull().references(() => stayupProjects.id, { onDelete: "cascade" }),
  stacktrace: text("stacktrace"),
  browserInfo: jsonb("browser_info").default("{}"),
  url: text("url"),
  method: text("method"),
  metadata: jsonb("metadata").default("{}"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const stayupTeams = pgTable("stayup_teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const stayupTeamMembers = pgTable("stayup_team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id").notNull().references(() => stayupTeams.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(), // owner, admin, member
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stayupHealthScans = pgTable("stayup_health_scans", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => stayupProjects.id, { onDelete: "cascade" }),
  summary: text("summary").notNull(),
  status: text("status").default("healthy").notNull(), // healthy, warning, critical
  details: jsonb("details").default("{}"), // Stores full report
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stayupNotificationRules = pgTable("stayup_notification_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => stayupProjects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  severityFilters: jsonb("severity_filters").default("[]"), // array of severities to trigger on
  environmentFilters: jsonb("environment_filters").default("[]"), // array of environments
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stayupNotifications = pgTable("stayup_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => stayupProjects.id, { onDelete: "cascade" }),
  issueId: uuid("issue_id").references(() => stayupIssues.id, { onDelete: "set null" }), // Optional link to specific issue
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Visual Editor Tables ────────────────────────────────────────────────────────

export const veAgencies = pgTable("ve_agencies", {
  id: uuid("id").defaultRandom().primaryKey(),
  connectAccountId: text("connect_account_id").default(""),
  customerId: text("customer_id").default(""),
  name: text("name").notNull(),
  agencyLogo: text("agency_logo").notNull(),
  companyEmail: text("company_email").notNull(),
  companyPhone: text("company_phone").notNull(),
  whiteLabel: boolean("white_label").default(true).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  zipCode: text("zip_code").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  goal: integer("goal").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veSubAccounts = pgTable("ve_sub_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  connectAccountId: text("connect_account_id").default(""),
  paypalClientId: text("paypal_client_id").default(""),
  name: text("name").notNull(),
  subAccountLogo: text("sub_account_logo").notNull(),
  companyEmail: text("company_email").notNull(),
  companyPhone: text("company_phone").notNull(),
  goal: integer("goal").default(5).notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  zipCode: text("zip_code").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  agencyId: uuid("agency_id").notNull().references(() => veAgencies.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vePermissions = pgTable("ve_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(), // Should relate to users.email
  subAccountId: uuid("sub_account_id").notNull().references(() => veSubAccounts.id, { onDelete: "cascade" }),
  access: boolean("access").notNull(),
});

export const veTags = pgTable("ve_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  subAccountId: uuid("sub_account_id").notNull().references(() => veSubAccounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const vePipelines = pgTable("ve_pipelines", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  subAccountId: uuid("sub_account_id").notNull().references(() => veSubAccounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veLanes = pgTable("ve_lanes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  pipelineId: uuid("pipeline_id").notNull().references(() => vePipelines.id, { onDelete: "cascade" }),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veTickets = pgTable("ve_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  laneId: uuid("lane_id").notNull().references(() => veLanes.id, { onDelete: "cascade" }),
  order: integer("order").default(0).notNull(),
  value: decimal("value"),
  description: text("description"),
  customerId: uuid("customer_id"), // refers to ve_contacts
  assignedUserId: uuid("assigned_user_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veTriggers = pgTable("ve_triggers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  subAccountId: uuid("sub_account_id").notNull().references(() => veSubAccounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veAutomations = pgTable("ve_automations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  triggerId: uuid("trigger_id").references(() => veTriggers.id, { onDelete: "cascade" }),
  published: boolean("published").default(false).notNull(),
  subAccountId: uuid("sub_account_id").notNull().references(() => veSubAccounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veActions = pgTable("ve_actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  automationId: uuid("automation_id").notNull().references(() => veAutomations.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  laneId: text("lane_id").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veFunnels = pgTable("ve_funnels", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  published: boolean("published").default(false).notNull(),
  subDomainName: text("sub_domain_name").unique(),
  favicon: text("favicon"),
  liveProducts: text("live_products").default("[]"),
  subAccountId: uuid("sub_account_id").notNull().references(() => veSubAccounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veFunnelPages = pgTable("ve_funnel_pages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  pathName: text("path_name").default("").notNull(),
  visits: integer("visits").default(0).notNull(),
  content: text("content"),
  order: integer("order").notNull(),
  previewImage: text("preview_image"),
  funnelId: uuid("funnel_id").notNull().references(() => veFunnels.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veFunnelsProduct = pgTable("ve_funnels_product", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  priceId: text("price_id").notNull(),
  subAccountId: uuid("sub_account_id").notNull().references(() => veSubAccounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const veContacts = pgTable("ve_contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subAccountId: uuid("sub_account_id").notNull().references(() => veSubAccounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- RELATIONS ---
export const usersRelations = relations(users, ({ one, many }) => ({
  Agency: one(veAgencies, { fields: [users.agencyId], references: [veAgencies.id] }),
  Permissions: many(vePermissions),
}));

export const veAgenciesRelations = relations(veAgencies, ({ many }) => ({
  SubAccount: many(veSubAccounts),
  Users: many(users),
}));

export const veSubAccountsRelations = relations(veSubAccounts, ({ one, many }) => ({
  Agency: one(veAgencies, { fields: [veSubAccounts.agencyId], references: [veAgencies.id] }),
  Permissions: many(vePermissions),
  Funnels: many(veFunnels),
  Contact: many(veContacts),
  Tags: many(veTags),
}));

export const vePermissionsRelations = relations(vePermissions, ({ one }) => ({
  User: one(users, { fields: [vePermissions.email], references: [users.email] }),
  SubAccount: one(veSubAccounts, { fields: [vePermissions.subAccountId], references: [veSubAccounts.id] }),
}));

export const veTagsRelations = relations(veTags, ({ one }) => ({
  SubAccount: one(veSubAccounts, { fields: [veTags.subAccountId], references: [veSubAccounts.id] }),
}));

export const veFunnelsRelations = relations(veFunnels, ({ one, many }) => ({
  SubAccount: one(veSubAccounts, { fields: [veFunnels.subAccountId], references: [veSubAccounts.id] }),
  FunnelPages: many(veFunnelPages),
}));

export const veFunnelPagesRelations = relations(veFunnelPages, ({ one }) => ({
  Funnel: one(veFunnels, { fields: [veFunnelPages.funnelId], references: [veFunnels.id] }),
}));

export const veFunnelsProductRelations = relations(veFunnelsProduct, ({ one }) => ({
  SubAccount: one(veSubAccounts, { fields: [veFunnelsProduct.subAccountId], references: [veSubAccounts.id] }),
}));

export const veContactsRelations = relations(veContacts, ({ one, many }) => ({
  SubAccount: one(veSubAccounts, { fields: [veContacts.subAccountId], references: [veSubAccounts.id] }),
  Ticket: many(veTickets),
}));

export const veTicketsRelations = relations(veTickets, ({ one }) => ({
  Contact: one(veContacts, { fields: [veTickets.customerId], references: [veContacts.id] }),
}));

// Legacy files table (kept to prevent data loss during migrations)
export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: text("chat_id"),
  path: text("path"),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
// Extracted from live DB to prevent Drizzle dropping them
export const globalSettings = pgTable("global_settings", {
  id: serial("id").primaryKey(),
  riskyPathKeywords: text("risky_path_keywords"),
  largePrThreshold: integer("large_pr_threshold"),
  missingTests: boolean("missing_tests"),
  dependencyChange: boolean("dependency_change"),
  reportFormat: text("report_format"),
  includeLowRisk: boolean("include_low_risk"),
  enablePostToGithub: boolean("enable_post_to_github"),
  githubAppInstallationId: text("github_app_installation_id"),
});

export const repositories = pgTable("repositories", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  fullName: text("full_name"),
  githubId: text("github_id"),
  connectedAt: timestamp("connected_at"),
});

export const adrRules = pgTable("adr_rules", {
  id: uuid("id").primaryKey(),
  repositoryId: uuid("repository_id"),
  title: text("title"),
  description: text("description"),
  severity: text("severity"),
  createdAt: timestamp("created_at"),
});

export const prReports = pgTable("pr_reports", {
  id: uuid("id").primaryKey(),
  repositoryId: uuid("repository_id"),
  prNumber: text("pr_number"),
  title: text("title"),
  riskLevel: text("risk_level"),
  summary: text("summary"),
  markdownReport: text("markdown_report"),
  createdAt: timestamp("created_at"),
});


