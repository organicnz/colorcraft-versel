import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables from .env.local and .env
dotenv.config({ path: ".env.local" });
dotenv.config();

// Direct configuration for initial setup
export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.DB_HOST || "db.tydgehnkaszuvcaywwdm.supabase.co",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres.tydgehnkaszuvcaywwdm",
    password: process.env.DB_PASSWORD || process.env.SUPABASE_SERVICE_ROLE_KEY,
    database: process.env.DB_DATABASE || "postgres",
    ssl: "require",
  },
} satisfies Config;
