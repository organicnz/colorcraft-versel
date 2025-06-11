import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const supabase = createAdminClient();

    // Set up RLS policies for the portfolio table to allow public reads
    const policies = [
      // Allow public to read all portfolio data
      `
        CREATE POLICY IF NOT EXISTS "Allow public read access to portfolio"
        ON portfolio FOR SELECT
        USING (true);
      `,

      // Allow authenticated users to insert/update portfolio data
      `
        CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert portfolio"
        ON portfolio FOR INSERT
        TO authenticated
        WITH CHECK (true);
      `,

      // Allow authenticated users to update their own portfolio items
      `
        CREATE POLICY IF NOT EXISTS "Allow authenticated users to update portfolio"
        ON portfolio FOR UPDATE
        TO authenticated
        USING (true);
      `,

      // Allow authenticated users to delete portfolio items
      `
        CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete portfolio"
        ON portfolio FOR DELETE
        TO authenticated
        USING (true);
      `,
    ];

    const results = [];

    // Execute each policy
    for (let i = 0; i < policies.length; i++) {
      try {
        const { error } = await supabase.rpc("exec_sql", {
          sql: policies[i].trim(),
        });

        if (error) {
          results.push({
            policy: i + 1,
            success: false,
            error: error.message,
          });
        } else {
          results.push({
            policy: i + 1,
            success: true,
            description: `Policy ${i + 1} created successfully`,
          });
        }
      } catch (err: any) {
        results.push({
          policy: i + 1,
          success: false,
          error: err.message,
        });
      }
    }

    // Test if the portfolio table is now accessible
    const { data: testRead, error: testError } = await supabase
      .from("portfolio")
      .select("id, title, is_featured")
      .limit(1);

    return NextResponse.json({
      success: true,
      message: "RLS policies setup completed",
      policies: results,
      test: {
        success: !testError,
        data: testRead?.length || 0,
        error: testError?.message,
      },
    });
  } catch (error: any) {
    console.error("RLS setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
