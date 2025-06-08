import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/config/env";
import { cookies } from "next/headers";

// Create cookie handlers for different contexts
const createDummyCookieHandlers = () => ({
  get: () => "",
  set: () => {},
  remove: () => {},
});

// Create a version that works during build time and runtime
export const createClient = async () => {
  try {
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
      return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
        cookies: createDummyCookieHandlers(),
      });
    }

    // In actual server runtime, use cookies
    const cookieStore = await cookies();

    return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    });
  } catch (error) {
    console.error("Supabase client initialization error:", error);
    // Fallback to dummy client to prevent app crash
    return createDummyClient();
  }
};

// Create a dummy client that won't crash but won't work either
function createDummyClient() {
  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key",
    { cookies: createDummyCookieHandlers() }
  );
}

// Simplified auth helper for server actions and server components
export async function auth() {
  const supabase = await createClient();
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    console.error("Error getting auth session:", error);
    return { data: { session: null } };
  }
}
