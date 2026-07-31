import { pgTable, text, timestamp, uuid, jsonb, boolean, integer } from "drizzle-orm/pg-core";

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
  balance: integer("balance").default(100).notNull(),
  subscriptionTier: text("subscription_tier").default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
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
