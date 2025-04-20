import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/config/env'

// Cache client to prevent multiple initializations
let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  // Return cached client if available
  if (cachedClient) {
    return cachedClient;
  }

  try {
    // Check if environment variables are defined
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables in client');
      throw new Error('Missing Supabase configuration');
    }

    // Create and cache the client
    cachedClient = createBrowserClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    return cachedClient;
  } catch (error) {
    console.error('Error initializing Supabase browser client:', error);
    // In production, create a dummy client that logs errors instead of crashing
    if (process.env.NODE_ENV === 'production') {
      console.warn('Creating dummy Supabase client for browser to prevent app crash');
      // Create a proxy object that logs errors for any method call
      const dummyClient = new Proxy({}, {
        get: function(target, prop) {
          // Return nested proxy for method chains
          if (typeof prop === 'string') {
            return new Proxy({}, {
              get: function() {
                return async () => {
                  console.error(`Supabase client method ${String(prop)} called but client failed to initialize`);
                  return { data: null, error: new Error('Supabase client not initialized') };
                };
              }
            });
          }
          return () => {};
        }
      });
      cachedClient = dummyClient as any;
      return cachedClient;
    }
    // In development, rethrow to make the error obvious
    throw error;
  }
}

// Reset client cache (useful for testing)
export function clearClientCache() {
  cachedClient = null;
} 