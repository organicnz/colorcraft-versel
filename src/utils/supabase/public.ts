import { createClient as createClientBase } from "@supabase/supabase-js";
import { env } from "@/lib/config/env";

interface SupabaseClient {
  from: (table: string) => {
    select: (columns?: string) => Promise<{ data: unknown; error: Error | null }>;
    insert: (data: unknown) => Promise<{ data: unknown; error: Error | null }>;
    update: (data: unknown) => Promise<{ data: unknown; error: Error | null }>;
    delete: () => Promise<{ data: unknown; error: Error | null }>;
  };
  auth: {
    signUp: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ data: unknown; error: Error | null }>;
    signIn: (credentials: {
      email: string;
      password: string;
    }) => Promise<{ data: unknown; error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
    getSession: () => Promise<{ data: { session: unknown }; error: Error | null }>;
  };
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File) => Promise<{ data: unknown; error: Error | null }>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
}

function createFallbackClient(): SupabaseClient {
  const logError = (operation: string) => {
    console.error(
      `Supabase operation '${operation}' called but client is not properly initialized`
    );
    return Promise.resolve({ data: null, error: new Error("Supabase client not initialized") });
  };

  return {
    from: () => ({
      select: () => logError("select"),
      insert: () => logError("insert"),
      update: () => logError("update"),
      delete: () => logError("delete"),
    }),
    auth: {
      signUp: () => logError("signUp"),
      signIn: () => logError("signIn"),
      signOut: () => Promise.resolve({ error: new Error("Auth not available") }),
      getSession: () =>
        Promise.resolve({ data: { session: null }, error: new Error("Auth not available") }),
    },
    storage: {
      from: () => ({
        upload: () => logError("upload"),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}

export function createPublicClient() {
  // Get values from environment variables
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if the API key looks valid
  const isValidKey = supabaseKey && supabaseKey.length > 100 && !supabaseKey.includes("\n");

  if (!supabaseUrl || !isValidKey) {
    console.error("Missing or invalid Supabase environment variables:", {
      url: supabaseUrl ? "defined" : "undefined",
      key_valid: isValidKey ? "valid" : "invalid",
      url_length: supabaseUrl?.length || 0,
      key_length: supabaseKey?.length || 0,
      node_env: process.env.NODE_ENV,
    });

    // During production builds or deployment, return a dummy client that gracefully handles operations
    if (process.env.NODE_ENV === "production") {
      console.warn("Creating a fallback Supabase client for production build");
      return createFallbackClient();
    }

    throw new Error(
      "Missing or invalid Supabase credentials. Check that the API URL and key are correctly formatted."
    );
  }

  try {
    return createClientBase(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Failed to create Supabase client:", error);

    if (process.env.NODE_ENV === "production") {
      return createFallbackClient();
    }

    throw error;
  }
}
