import { env } from "@/lib/config/env";

/**
 * Database configuration utils for Supabase PostgreSQL
 */
export const getDatabaseConfig = () => {
  try {
    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
    }

    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (!match) {
      throw new Error(`Invalid Supabase URL format: ${url}`);
    }

    const projectId = match[1];
    const host = `db.${projectId}.supabase.co`;

    if (!env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
    }

    return {
      host,
      port: 5432,
      projectId,
      database: "postgres",
      connectionString: `postgres://postgres.${projectId}:${env.SUPABASE_SERVICE_ROLE_KEY}@${host}:5432/postgres`,
      ssl: { rejectUnauthorized: false } as const,
    };
  } catch (error) {
    console.error("Database configuration error:", error);
    throw error;
  }
};

/**
 * Get environment-specific pool size
 * - Development: Smaller pool to conserve resources
 * - Production: Larger pool for better concurrency
 */
export const getPoolSize = (): number => {
  const isDevelopment = process.env.NODE_ENV === "development";
  return isDevelopment ? 5 : 20; // 5 connections in dev, 20 in production
};

/**
 * Common PostgreSQL client options with environment-specific settings
 * @param customOptions - Override default options
 * @returns Configured PostgreSQL client options
 */
export const getClientOptions = (customOptions = {}) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    ssl: { rejectUnauthorized: false },
    max: getPoolSize(),
    idle_timeout: isDevelopment ? 10 : 30, // Shorter timeout in dev
    connect_timeout: 10,
    prepare: true, // Enable prepared statements for better performance
    // Add connection health check
    onConnect: async (client: any) => {
      try {
        // Execute a simple query to verify connection is healthy
        await client.query("SELECT 1");
      } catch (err) {
        console.error("Database connection health check failed:", err);
        throw err;
      }
    },
    ...customOptions,
  };
};

/**
 * Get client options specifically for migrations
 * Migrations need different settings to avoid timeouts
 */
export const getMigrationClientOptions = () => {
  return getClientOptions({
    max: 1, // Only need one connection for migrations
    idle_timeout: 60, // Longer timeout for migrations
    connect_timeout: 30, // Longer connect timeout for migrations
    statement_timeout: 60 * 1000, // 1 minute timeout for migration statements
  });
};
