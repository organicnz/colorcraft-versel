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

// Create a version that works during build time and runtime
export const createClient = () => {
  // Return cached client if available (improves performance in server components)
  if (cachedClient) {
    return cachedClient;
  }

  try {
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
            return cookieStore.get(name)?.value;
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
    console.debug("Cookie handler initialization error");

    // Fallback for any other context
    cachedClient = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies: createDummyCookieHandlers() }
    );

    return cachedClient;
  }
};

// Reset cache when needed (useful for testing)
export function clearClientCache() {
  cachedClient = null;
}

// Simplified auth helper for server actions and server components
export async function auth() {
  const supabase = createClient();
  return supabase.auth.getSession();
}
