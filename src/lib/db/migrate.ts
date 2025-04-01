import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '@/lib/config/env';

// Database connection for migrations
const migrationConnection = postgres(
  env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.co', '.supabase.co:5432') + '/postgres', 
  { 
    user: env.SUPABASE_SERVICE_ROLE_KEY,
    password: env.SUPABASE_SERVICE_ROLE_KEY,
    max: 1,
  }
);

// Initialize Drizzle with migration connection
const db = drizzle(migrationConnection);

console.log('🔄 Starting database migrations...');

// Run migrations
migrate(db, { migrationsFolder: './src/lib/db/migrations' })
  .then(() => {
    console.log('✅ Migrations completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed');
    console.error(error);
    process.exit(1);
  });
