import type { Config } from "drizzle-kit";
import { env } from "./src/lib/config/env";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.co', '.supabase.co:5432') + '/postgres',
    user: env.SUPABASE_SERVICE_ROLE_KEY,
    password: env.SUPABASE_SERVICE_ROLE_KEY,
  },
} satisfies Config;
