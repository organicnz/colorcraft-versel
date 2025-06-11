import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    const results: unknown = {
      timestamp: new Date().toISOString(),
      tests: [],
    };

    // 1. Server-side Supabase client
    console.warn("🔍 Testing server-side Supabase client...");
    try {
      const supabase = await createClient();

      // Test basic connection
      const { data: serverAuth, error: serverAuthError } = await supabase.auth.getSession();
      results.tests.push({
        name: "Server Auth Check",
        success: !serverAuthError,
        data: { hasSession: !!serverAuth?.session },
        error: serverAuthError?.message || null,
      });

      // Test database query - try users table
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email, role")
        .limit(3);

      results.tests.push({
        name: "Users Table Query",
        success: !usersError,
        data:
          usersData?.map((u) => ({
            id: u.id,
            email: u.email?.substring(0, 3) + "***",
            role: u.role,
          })) || [],
        error: usersError?.message || null,
        count: usersData?.length || 0,
      });

      // Test portfolio table (the one we're fixing)
      const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolio")
        .select("id, title, is_featured")
        .limit(3);

      results.tests.push({
        name: "Portfolio Table Query",
        success: !portfolioError,
        data: portfolioData || [],
        error: portfolioError?.message || null,
        count: portfolioData?.length || 0,
      });
    } catch (serverError: any) {
      results.tests.push({
        name: "Server Client Error",
        success: false,
        error: serverError.message,
      });
    }

    // 2. Test Service Role Access (admin privileges)
    console.warn("🔍 Testing service role access...");
    try {
      const { createClient: createServiceClient } = await import("@supabase/supabase-js");
      const { env } = await import("@/lib/config/env");

      const serviceClient = createServiceClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Test admin-level query
      const { data: adminUsersData, error: adminUsersError } = await serviceClient
        .from("users")
        .select("id, email, role, created_at")
        .limit(2);

      results.tests.push({
        name: "Service Role Users Query",
        success: !adminUsersError,
        data:
          adminUsersData?.map((u) => ({
            id: u.id,
            email: u.email?.substring(0, 5) + "***",
            role: u.role,
            created: u.created_at?.substring(0, 10),
          })) || [],
        error: adminUsersError?.message || null,
        count: adminUsersData?.length || 0,
      });

      // Test database introspection with service role
      const { data: tablesData, error: tablesError } = await serviceClient.rpc("exec_sql", {
        sql: `
            SELECT table_name, table_type
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
          `,
      });

      results.tests.push({
        name: "Database Tables Introspection",
        success: !tablesError,
        data: tablesData || [],
        error: tablesError?.message || null,
      });
    } catch (serviceError: any) {
      results.tests.push({
        name: "Service Role Error",
        success: false,
        error: serviceError.message,
      });
    }

    // 3. Raw HTTP API Access
    console.warn("🔍 Testing raw HTTP API access...");
    try {
      const { env } = await import("@/lib/config/env");

      const response = await fetch(
        `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/users?select=id,role&limit=2`,
        {
          headers: {
            apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const httpData = await response.json();
        results.tests.push({
          name: "Raw HTTP API Access",
          success: true,
          data: httpData,
          count: httpData?.length || 0,
        });
      } else {
        results.tests.push({
          name: "Raw HTTP API Access",
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        });
      }
    } catch (httpError: any) {
      results.tests.push({
        name: "Raw HTTP API Error",
        success: false,
        error: httpError.message,
      });
    }

    // 4. Real-time subscriptions test (concept)
    results.tests.push({
      name: "Real-time Capabilities",
      success: true,
      data: {
        note: "Real-time subscriptions can be set up using supabase.channel()",
        examples: [
          'Table changes: supabase.channel("portfolio-changes").on("postgres_changes", ...)',
          'Custom broadcasts: supabase.channel("custom").on("broadcast", ...)',
          'Presence tracking: supabase.channel("room").track(userState)',
        ],
      },
    });

    // Summary
    const successfulTests = results.tests.filter((t: any) => t.success).length;
    const totalTests = results.tests.length;

    return NextResponse.json({
      success: true,
      summary: {
        total_tests: totalTests,
        successful: successfulTests,
        failed: totalTests - successfulTests,
        success_rate: `${Math.round((successfulTests / totalTests) * 100)}%`,
      },
      environment: {
        node_env: process.env.NODE_ENV,
        has_supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        has_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      capabilities: {
        database_queries: "SELECT, INSERT, UPDATE, DELETE operations",
        authentication: "Sign up, sign in, password reset, OAuth",
        real_time: "Live data subscriptions and presence",
        storage: "File upload, download, and management",
        edge_functions: "Server-side functions in Deno runtime",
        row_level_security: "Fine-grained access control",
      },
      results,
    });
  } catch (error: any) {
    console.error("Supabase demo error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to run Supabase demo",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json();
    const supabase = await createClient();

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    switch (action) {
      case "create_sample_portfolio":
        // Create a sample portfolio entry
        const { data: portfolioResult, error: portfolioError } = await supabase
          .from("portfolio")
          .insert([
            {
              title: "Sample Project",
              brief_description: "A sample portfolio project created programmatically",
              description: "This is a demonstration of programmatic Supabase access.",
              before_images: ["https://example.com/before.jpg"],
              after_images: ["https://example.com/after.jpg"],
              materials: ["Paint", "Brushes"],
              techniques: ["Spray painting"],
              is_featured: false,
            },
          ])
          .select()
          .single();

        return NextResponse.json({
          success: !portfolioError,
          action: "create_sample_portfolio",
          data: portfolioResult,
          error: portfolioError?.message || null,
        });

      case "test_storage":
        // Test storage access
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

        return NextResponse.json({
          success: !bucketsError,
          action: "test_storage",
          data: buckets,
          error: bucketsError?.message || null,
        });

      default:
        return NextResponse.json(
          {
            error: "Unknown action",
            available_actions: ["create_sample_portfolio", "test_storage"],
          },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "POST request failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
