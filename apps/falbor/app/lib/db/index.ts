// import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://dummy:dummy@dummy/dummy";
if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is not defined in process.env!");
}
const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
