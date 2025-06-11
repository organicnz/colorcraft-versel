import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const supabase = createClient();

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Read the migration file
    const migrationPath = path.join(process.cwd(), "sql", "migrations", "create_team_table.sql");
    const migrationSQL = await fs.readFile(migrationPath, "utf-8");

    // Execute the migration
    const { data, error } = await supabase.rpc("exec_sql", {
      sql_query: migrationSQL,
    });

    if (error) {
      console.error("Migration error:", error);

      // If the function doesn't exist, try direct execution
      if (error.message?.includes("function exec_sql")) {
        // Split the SQL into individual statements and execute them
        const statements = migrationSQL
          .split(";")
          .map((stmt) => stmt.trim())
          .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

        for (const statement of statements) {
          if (statement.includes("select ") && statement.includes("message")) {
            // Skip the final success message statement
            continue;
          }

          const { error: execError } = await supabase.from("dummy").select("*").limit(0);

          // Try a different approach - use the service role client
          const serviceClient = createClient();
          const { error: stmtError } = await serviceClient.rpc("exec", { sql: statement });

          if (stmtError) {
            console.error("Statement error:", stmtError, "for statement:", statement);
            // Continue with other statements
          }
        }
      } else {
        return NextResponse.json(
          {
            error: "Failed to run migration",
            details: error.message,
          },
          { status: 500 }
        );
      }
    }

    // Test if the table was created successfully
    const { data: testData, error: testError } = await supabase
      .from("team")
      .select("count")
      .limit(1);

    if (testError) {
      return NextResponse.json(
        {
          error: "Table creation failed",
          details: testError.message,
          suggestion: "Please run the migration manually in Supabase SQL Editor",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Team table created successfully!",
      migrationExecuted: true,
      tableExists: true,
    });
  } catch (error: any) {
    console.error("Error creating team table:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
        suggestion: "Please run the SQL migration manually in Supabase SQL Editor",
      },
      { status: 500 }
    );
  }
}
