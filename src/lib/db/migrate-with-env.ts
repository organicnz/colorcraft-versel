import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { getDatabaseConfig, getClientOptions } from "./config";

// Load environment variables from .env.local and .env
dotenv.config({ path: ".env.local" });
dotenv.config();

async function runMigrations() {
  try {
    console.warn("🔌 Connecting to Supabase database...");
    const dbConfig = getDatabaseConfig();

    // Create migration-specific connection options
    const migrationOptions = getClientOptions({
      max: 1, // Use a single connection for migrations
      connect_timeout: 30, // Longer timeout for migrations
    });

    // Create the Postgres connection
    const migrationConnection = postgres(dbConfig.connectionString, migrationOptions);

    // Initialize Drizzle with migration connection
    const db = drizzle(migrationConnection);

    console.warn("🔄 Starting database migrations...");

    // Run migrations
    await migrate(db, { migrationsFolder: "./src/lib/db/migrations" });
    console.warn("✅ Migrations completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed");
    console.error(error);
    process.exit(1);
  }
}

// Execute migrations
runMigrations();
