import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

    // Get portfolio table schema
    const { data: portfolioColumns, error: portfolioError } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'portfolio'
        ORDER BY ordinal_position;
      `,
    });

    // Get users table schema
    const { data: usersColumns, error: usersError } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `,
    });

    // Get portfolio table indexes
    const { data: portfolioIndexes, error: indexError } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT
          schemaname,
          tablename,
          indexname,
          indexdef
        FROM pg_indexes
        WHERE tablename = 'portfolio'
        ORDER BY indexname;
      `,
    });

    // Get portfolio table constraints
    const { data: portfolioConstraints, error: constraintError } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT
          conname as constraint_name,
          contype as constraint_type,
          pg_get_constraintdef(oid) as constraint_definition
        FROM pg_constraint
        WHERE conrelid = 'portfolio'::regclass
        ORDER BY conname;
      `,
    });

    // Get table sizes and row counts
    const { data: tableStats, error: statsError } = await supabase.rpc("exec_sql", {
      sql: `
        SELECT
          'portfolio' as table_name,
          (SELECT COUNT(*) FROM portfolio) as row_count,
          pg_size_pretty(pg_total_relation_size('portfolio')) as total_size
        UNION ALL
        SELECT
          'users' as table_name,
          (SELECT COUNT(*) FROM users) as row_count,
          pg_size_pretty(pg_total_relation_size('users')) as total_size;
      `,
    });

    // Sample portfolio data to understand structure
    const { data: portfolioSample, error: sampleError } = await supabase
      .from("portfolio")
      .select("*")
      .limit(2);

    return NextResponse.json({
      success: true,
      schema: {
        portfolio: {
          columns: portfolioColumns,
          indexes: portfolioIndexes,
          constraints: portfolioConstraints,
          sample_data: portfolioSample,
          error: portfolioError?.message,
        },
        users: {
          columns: usersColumns,
          error: usersError?.message,
        },
        statistics: {
          table_stats: tableStats,
          error: statsError?.message,
        },
      },
      errors: {
        portfolio: portfolioError?.message || null,
        users: usersError?.message || null,
        indexes: indexError?.message || null,
        constraints: constraintError?.message || null,
        stats: statsError?.message || null,
        sample: sampleError?.message || null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Schema inspection error:", error);
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
