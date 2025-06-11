import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // Check if we have admin access
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get user role
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    // Execute portfolio table creation
    const portfolioTableSQL = `
      -- Create portfolio table if it doesn't exist
      CREATE TABLE IF NOT EXISTS portfolio (
        id uuid default uuid_generate_v4() primary key,
        title text not null,
        description text,
        brief_description text not null,
        before_images text[] not null default '{}',
        after_images text[] not null default '{}',
        techniques text[] default '{}',
        materials text[] default '{}',
        completion_date date,
        client_name text,
        client_testimonial text,
        is_featured boolean default false,
        created_at timestamp with time zone default now() not null,
        updated_at timestamp with time zone default now() not null
      );

      -- Enable Row Level Security
      ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
    `;

    const { error: tableError } = await supabase.rpc("exec_sql", {
      sql: portfolioTableSQL,
    });

    if (tableError) {
      console.error("Table creation error:", tableError);

      // Try alternative approach using individual operations
      const results = [];

      // Try to create table using direct insert/upsert approach
      try {
        // Test if table exists by trying to select from it
        const { error: testError } = await supabase.from("portfolio").select("id").limit(1);

        if (testError && testError.code === "42P01") {
          // Table doesn't exist
          results.push({
            action: "table_check",
            status: "table_missing",
            error: testError.message,
          });
        } else {
          // Table exists
          results.push({
            action: "table_check",
            status: "table_exists",
          });
        }
      } catch (error: any) {
        results.push({
          action: "table_check",
          status: "error",
          error: error.message,
        });
      }

      return NextResponse.json({
        success: false,
        error: "Cannot create table directly through Supabase client",
        details: tableError.message,
        suggestions: [
          "The table needs to be created through Supabase dashboard SQL editor",
          "Or apply migrations through Supabase CLI",
          "Current error indicates insufficient permissions for DDL operations",
        ],
        results,
        sql: portfolioTableSQL,
      });
    }

    // If we get here, table creation was successful
    // Now create RLS policies
    const policiesSQL = `
      -- Create policies
      CREATE POLICY IF NOT EXISTS "Portfolio projects are viewable by everyone."
        ON portfolio FOR SELECT
        USING (true);

      CREATE POLICY IF NOT EXISTS "Only admins can insert portfolio projects."
        ON portfolio FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
          )
        );

      CREATE POLICY IF NOT EXISTS "Only admins can update portfolio projects."
        ON portfolio FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
          )
        );

      CREATE POLICY IF NOT EXISTS "Only admins can delete portfolio projects."
        ON portfolio FOR DELETE
        USING (
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
          )
        );
    `;

    const { error: policiesError } = await supabase.rpc("exec_sql", {
      sql: policiesSQL,
    });

    return NextResponse.json({
      success: true,
      message: "Portfolio table and policies created successfully",
      tableError: tableError?.message || null,
      policiesError: policiesError?.message || null,
    });
  } catch (error: any) {
    console.error("Fix Supabase error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
