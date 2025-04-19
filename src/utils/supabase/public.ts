import { createClient as createClientBase } from '@supabase/supabase-js';

export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Add fallback values for build-time and deployment scenarios
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'defined' : 'undefined',
      key: supabaseKey ? 'defined' : 'undefined',
      url_length: supabaseUrl?.length || 0,
      key_length: supabaseKey?.length || 0,
      node_env: process.env.NODE_ENV
    });
    
    // During production builds or deployment, return a dummy client that gracefully handles operations
    if (process.env.NODE_ENV === 'production') {
      console.warn('Creating a fallback Supabase client for production build');
      return createFallbackClient();
    }
    
    throw new Error(
      'Missing Supabase environment variables. Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.'
    );
  }

  try {
    // Create a direct client without cookies for public pages
    // Include both the apikey and Authorization headers with the key
    return createClientBase(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    });
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    
    // In production, use fallback client instead of failing
    if (process.env.NODE_ENV === 'production') {
      console.warn('Using fallback Supabase client due to initialization error');
      return createFallbackClient();
    }
    
    throw error;
  }
}

// Fallback client that returns empty arrays instead of failing
function createFallbackClient() {
  return {
    from: () => ({
      select: () => ({
        order: () => {
          return Promise.resolve({ data: [], error: null });
        },
        eq: () => {
          return Promise.resolve({ data: [], error: null });
        },
        single: () => {
          return Promise.resolve({ data: null, error: null });
        },
      }),
      eq: () => ({
        order: () => {
          return Promise.resolve({ data: [], error: null });
        },
        single: () => {
          return Promise.resolve({ data: null, error: null });
        },
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    storage: {
      from: () => ({
        list: () => Promise.resolve({ data: [], error: null }),
      }),
    },
  };
}