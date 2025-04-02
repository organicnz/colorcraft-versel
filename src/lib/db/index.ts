import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDatabaseConfig, getClientOptions } from './config';
import { logger } from '@/lib/logger';

// Database instance state tracker
let isConnected = false;

// Initialize database client with error handling
let client: ReturnType<typeof postgres>;
let db: ReturnType<typeof drizzle>;

/**
 * Initialize the database connection
 * This is done lazily to avoid connecting during build time
 */
function initializeDatabase() {
  if (isConnected) return;
  
  try {
    const dbConfig = getDatabaseConfig();
    client = postgres(dbConfig.connectionString, getClientOptions());
    db = drizzle(client);
    isConnected = true;
    
    logger.info('Database connection initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database client:', error);
    
    // Create a minimal fallback that will throw errors when methods are called
    // This prevents startup errors but will fail gracefully when accessed
    client = {} as any;
    db = drizzle(client);
  }
}

// Initialize connection immediately in production, lazily in development
if (process.env.NODE_ENV === 'production') {
  initializeDatabase();
}

/**
 * Get the database instance, initializing it if necessary
 * @returns Drizzle database instance
 */
export function getDb() {
  if (!isConnected) {
    initializeDatabase();
  }
  return db;
}

// For backward compatibility
export { db };

/**
 * Explicitly close the database connection
 * Useful for cleanup in tests and serverless environments
 */
export async function closeDb() {
  if (isConnected && client && typeof client.end === 'function') {
    try {
      await client.end();
      isConnected = false;
      logger.info('Database connection closed successfully');
    } catch (error) {
      logger.error('Error closing database connection:', error);
    }
  }
}
