import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // Create client directly with environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test a very simple query first
    const { data, error } = await supabase.from("auth.users").select("count").limit(1);

    if (error) {
      // Try a different table that should always exist
      const { data: authData, error: authError } = await supabase.auth.getSession();

      return NextResponse.json({
        success: false,
        simpleQueryError: error.message,
        authTest: authError ? authError.message : "Auth works",
        url: supabaseUrl.substring(0, 30) + "...",
        keyLength: supabaseKey.length,
        keyStart: supabaseKey.substring(0, 20) + "...",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Direct connection works",
      data,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
}
