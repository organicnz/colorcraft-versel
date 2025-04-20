import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/config/env";

// Create cookie handlers for different contexts
const createDummyCookieHandlers = () => ({
  get: () => "",
  set: () => {},
  remove: () => {},
});

// Memoize client to prevent repeated initialization
let cachedClient: ReturnType<typeof createServerClient> | null = null;
let initializationAttempts = 0;
const MAX_INIT_ATTEMPTS = 3;

// Create a version that works during build time and runtime
export const createClient = () => {
  // Return cached client if available (improves performance in server components)
  if (cachedClient) {
    return cachedClient;
  }

  try {
    // Increment initialization attempts
    initializationAttempts++;

    // Check for missing environment variables - fail gracefully in production
    if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables");
      if (process.env.NODE_ENV === "production") {
        console.warn("Creating dummy Supabase client to prevent deployment failure");
        return createDummyClient();
      }
    }

    // During build, provide a dummy implementation that won't fail
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      cachedClient = createServerClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        { cookies: createDummyCookieHandlers() }
      );
      return cachedClient;
    }

    // In actual server runtime, dynamically import cookies
    // This prevents build-time errors with next/headers
    const { cookies } = require("next/headers");
    const cookieStore = cookies();

    cachedClient = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            try {
              return cookieStore.get(name)?.value;
            } catch (error) {
              console.debug("Cookie get error (expected in some contexts)");
              return undefined;
            }
          },
          set(name, value, options) {
            try {
              cookieStore.set(name, value, options);
            } catch (error) {
              // This will fail in middleware, but we can ignore it
              console.debug("Cookie set error (expected in middleware)");
            }
          },
          remove(name, options) {
            try {
              cookieStore.set(name, "", { ...options, maxAge: 0 });
            } catch (error) {
              // This will fail in middleware, but we can ignore it
              console.debug("Cookie remove error (expected in middleware)");
            }
          },
        },
      }
    );

    return cachedClient;
  } catch (error) {
    console.error("Supabase client initialization error:", error);

    // Log additional information to help debugging
    if (initializationAttempts >= MAX_INIT_ATTEMPTS) {
      console.error(
        `Failed to initialize Supabase client after ${initializationAttempts} attempts`
      );
      console.error(`NEXT_PUBLIC_SUPABASE_URL defined: ${Boolean(env.NEXT_PUBLIC_SUPABASE_URL)}`);
      console.error(
        `NEXT_PUBLIC_SUPABASE_ANON_KEY defined: ${Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY)}`
      );
    }

    // Fallback to dummy client to prevent app crash
    return createDummyClient();
  }
};

// Create a dummy client that won't crash but won't work either
function createDummyClient() {
  // If we already have a cached dummy client, return it
  if (cachedClient) {
    return cachedClient;
  }

  // Create a new dummy client
  cachedClient = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key",
    { cookies: createDummyCookieHandlers() }
  );

  return cachedClient;
}

// Reset cache when needed (useful for testing)
export function clearClientCache() {
  cachedClient = null;
  initializationAttempts = 0;
}

// Simplified auth helper for server actions and server components
export async function auth() {
  const supabase = createClient();
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    console.error("Error getting auth session:", error);
    return { data: { session: null } };
  }
}
