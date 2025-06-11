import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
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

    // Check if columns already exist
    const checkColumnsSQL = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'portfolio'
      AND column_name IN ('is_published', 'is_draft')
      AND table_schema = 'public';
    `;

    const { data: existingColumns, error: checkError } = await supabase.rpc("exec_sql", {
      sql: checkColumnsSQL,
    });

    if (checkError) {
      return NextResponse.json(
        {
          error: "Failed to check existing columns",
          details: checkError.message,
        },
        { status: 500 }
      );
    }

    const hasIsPublished = existingColumns?.some((row: any) => row.column_name === "is_published");
    const hasIsDraft = existingColumns?.some((row: any) => row.column_name === "is_draft");

    if (hasIsPublished && hasIsDraft) {
      return NextResponse.json({
        success: true,
        message: "Columns already exist - migration not needed",
        columnsExist: { is_published: true, is_draft: true },
      });
    }

    // Apply the migration
    const migrationSQL = `
      -- Add draft and published status fields to portfolio table
      -- This migration adds the necessary fields for draft/published workflow

      -- Add is_published and is_draft columns to portfolio table if they don&apos;t exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'portfolio'
          AND column_name = 'is_published'
          AND table_schema = 'public'
        ) THEN
          ALTER TABLE portfolio ADD COLUMN is_published boolean DEFAULT false NOT NULL;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'portfolio'
          AND column_name = 'is_draft'
          AND table_schema = 'public'
        ) THEN
          ALTER TABLE portfolio ADD COLUMN is_draft boolean DEFAULT true NOT NULL;
        END IF;
      END $$;

      -- Create indexes for better performance on status queries
      CREATE INDEX IF NOT EXISTS portfolio_published_idx ON portfolio(is_published);
      CREATE INDEX IF NOT EXISTS portfolio_draft_idx ON portfolio(is_draft);
      CREATE INDEX IF NOT EXISTS portfolio_status_idx ON portfolio(is_published, is_draft);

      -- Add check constraint to ensure logical consistency (can&apos;t be both published and draft)
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_name = 'portfolio'
          AND constraint_name = 'portfolio_status_check'
          AND table_schema = 'public'
        ) THEN
          ALTER TABLE portfolio
          ADD CONSTRAINT portfolio_status_check
          CHECK (NOT (is_published = true AND is_draft = true));
        END IF;
      END $$;

      -- Update existing records to have consistent state (published = not draft)
      -- Set featured projects as published, others as drafts
      UPDATE portfolio
      SET is_published = COALESCE(is_featured, false),
          is_draft = NOT COALESCE(is_featured, false)
      WHERE is_published IS NULL OR is_draft IS NULL;
    `;

    const { error: migrationError } = await supabase.rpc("exec_sql", {
      sql: migrationSQL,
    });

    if (migrationError) {
      return NextResponse.json(
        {
          error: "Migration failed",
          details: migrationError.message,
        },
        { status: 500 }
      );
    }

    // Verify the migration was successful
    const verifySQL = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'portfolio'
      AND column_name IN ('is_published', 'is_draft')
      AND table_schema = 'public'
      ORDER BY column_name;
    `;

    const { data: verificationData, error: verificationError } = await supabase.rpc("exec_sql", {
      sql: verifySQL,
    });

    if (verificationError) {
      console.warn("Verification failed:", verificationError);
    }

    // Get count of updated records
    const { data: counts } = await supabase
      .from("portfolio")
      .select("is_published, is_draft")
      .then((result) => {
        if (result.error) return { data: null };
        const published = result.data?.filter((item) => item.is_published).length || 0;
        const drafts = result.data?.filter((item) => item.is_draft).length || 0;
        return { data: { published, drafts, total: result.data?.length || 0 } };
      });

    return NextResponse.json({
      success: true,
      message: "Portfolio draft/published fields migration completed successfully",
      verification: verificationData || null,
      counts: counts || null,
      appliedChanges: {
        addedColumns: !hasIsPublished || !hasIsDraft,
        createdIndexes: true,
        addedConstraints: true,
        updatedRecords: true,
      },
    });
  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error during migration",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Portfolio Fields Migration API",
    description:
      "Use POST to apply migration that adds is_published and is_draft fields to portfolio table",
    endpoint: "/api/migrate-portfolio-fields",
    requiresAdmin: true,
  });
}
