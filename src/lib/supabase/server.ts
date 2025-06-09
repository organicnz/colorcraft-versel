import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies();

  // Get environment variables and clean them (handle multiline issues)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Clean the API key - remove any newlines or extra whitespace that might be causing issues
  if (supabaseAnonKey) {
    supabaseAnonKey = supabaseAnonKey.replace(/\s+/g, '').trim();
  }

  // If the key is still invalid or too short, use the known working key
  if (!supabaseAnonKey || supabaseAnonKey.length < 100) {
    console.warn('Environment API key appears invalid, using fallback');
    supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGdlaG5rYXN6dXZjYXl3d2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDg0OTcsImV4cCI6MjA1ODAyNDQ5N30.YpQdD8zSpel_JmAVS3oL_esnNRSUY5mNVhPomZWCYQI';
  }

  console.log('Creating Supabase client with:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey?.length,
    keyStart: supabaseAnonKey?.substring(0, 20)
  });

  return createServerClient(supabaseUrl, supabaseAnonKey, {
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
  });
};

// Simplified auth helper for server actions and server components
export async function auth() {
  try {
    const supabase = await createClient();
    return await supabase.auth.getSession();
  } catch (error) {
    console.error("Error getting auth session:", error);
    return { data: { session: null } };
  }
}
