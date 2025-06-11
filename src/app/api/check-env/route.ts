import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Gather environment variable info
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Check the variables and report their status
    const envInfo = {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "exists" : "missing",
      NEXT_PUBLIC_SUPABASE_URL_length: supabaseUrl?.length || 0,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "exists" : "missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY_length: supabaseAnonKey?.length || 0,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_preview: supabaseAnonKey
        ? `${supabaseAnonKey.substring(0, 5)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}`
        : "n/a",
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey ? "exists" : "missing",
      SUPABASE_SERVICE_ROLE_KEY_length: supabaseServiceRoleKey?.length || 0,
    };

    console.warn("Debug API called - checking environment variables:", envInfo);

    // Return info to the client
    return NextResponse.json({
      status: "success",
      environment: process.env.NODE_ENV,
      env_variables: envInfo,
      instructions: `
        If NEXT_PUBLIC_SUPABASE_ANON_KEY is missing:
        1. Go to your .env.local file locally and find the value
        2. Add it to your Vercel project's Environment Variables
        3. Make sure it&apos;s enabled for Production, Preview and Development
        4. Redeploy your application
      `,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to check environment variables",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
