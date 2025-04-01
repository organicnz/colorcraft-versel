import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '@/lib/config/env';

// For use on the server (API routes, Server Components, etc.)
const connectionString = env.NEXT_PUBLIC_SUPABASE_URL.replace('.supabase.co', '.supabase.co:5432') + '/postgres';
const client = postgres(connectionString, {
  user: env.SUPABASE_SERVICE_ROLE_KEY,
  password: env.SUPABASE_SERVICE_ROLE_KEY,
  prepare: false,
});

export const db = drizzle(client);
