import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  tablesFilter: ["creator_*"],
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
