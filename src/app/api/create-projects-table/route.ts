import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: "Missing Supabase configuration",
        },
        { status: 500 }
      );
    }

    // Create admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.warn("Creating projects table...");

    // First check if table already exists
    const { data: testData, error: testError } = await supabase
      .from("projects")
      .select("id")
      .limit(1);

    if (!testError) {
      return NextResponse.json({
        message: "Projects table already exists",
        success: true,
      });
    }

    // Since we can&apos;t use RPC to execute raw SQL directly through the SDK,
    // we&apos;ll try a different approach - create the table through database operations

    // For now, let's return the SQL that needs to be executed manually
    const sql = `
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  brief_description text NOT NULL,
  before_images text[] NOT NULL,
  after_images text[] NOT NULL,
  techniques text[],
  materials text[],
  completion_date date,
  client_name text,
  client_testimonial text,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Projects are viewable by everyone."
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert projects."
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update projects."
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete projects."
  ON projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
`;

    return NextResponse.json({
      error: "Table does not exist",
      sql: sql,
      instruction: "Execute this SQL in your Supabase dashboard SQL editor",
      dashboard_url: `${supabaseUrl.replace("//", "//app.")}/project/_/sql`,
    });
  } catch (error: any) {
    console.error("Error in create-projects-table:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
