import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString: connectionString || "postgresql://mock:mock@localhost:5432/mock" });

export const db = drizzle(pool, { schema });
