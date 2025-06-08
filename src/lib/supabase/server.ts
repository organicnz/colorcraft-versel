import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/config/env";
import { cookies } from "next/headers";

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // This can happen during SSR or when the response has already been sent
            // We can safely ignore this error in most cases
            console.warn("Failed to set cookie:", name, error);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch (error) {
            // This can happen during SSR or when the response has already been sent
            // We can safely ignore this error in most cases
            console.warn("Failed to remove cookie:", name, error);
          }
        },
      },
    }
  );
};

// Simplified auth helper for server actions and server components
export async function auth() {
  try {
    const supabase = createClient();
    return await supabase.auth.getSession();
  } catch (error) {
    console.error("Error getting auth session:", error);
    return { data: { session: null } };
  }
}
