import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    //url: "postgresql://postgres:postgres@localhost:5432/postgres",
  },
  tablesFilter: ["files", "users", "chats", "messages", "hacking_chats", "hacking_messages"], // Only include schema tables
});
