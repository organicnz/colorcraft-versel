import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if we have admin access
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check if columns already exist
    const checkColumnsSQL = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'portfolio' 
      AND column_name IN ('created_by', 'updated_by', 'is_archived')
      AND table_schema = 'public';
    `;

    const { data: existingColumns, error: checkError } = await supabase
      .rpc('exec_sql', { sql: checkColumnsSQL });

    if (checkError) {
      return NextResponse.json({ 
        error: 'Failed to check existing columns', 
        details: checkError.message 
      }, { status: 500 });
    }

    const hasCreatedBy = existingColumns?.some((row: any) => row.column_name === 'created_by');
    const hasUpdatedBy = existingColumns?.some((row: any) => row.column_name === 'updated_by');
    const hasIsArchived = existingColumns?.some((row: any) => row.column_name === 'is_archived');

    if (hasCreatedBy && hasUpdatedBy && hasIsArchived) {
      return NextResponse.json({
        success: true,
        message: 'User tracking columns already exist - migration not needed',
        columnsExist: { created_by: true, updated_by: true, is_archived: true }
      });
    }

    // Apply the migration
    const migrationSQL = `
      -- Add user tracking and archive functionality to portfolio table
      -- This migration adds created_by, updated_by, and is_archived fields

      -- Add created_by, updated_by, and is_archived columns to portfolio table
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'portfolio' 
          AND column_name = 'created_by' 
          AND table_schema = 'public'
        ) THEN
          ALTER TABLE portfolio ADD COLUMN created_by uuid REFERENCES auth.users(id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'portfolio' 
          AND column_name = 'updated_by' 
          AND table_schema = 'public'
        ) THEN
          ALTER TABLE portfolio ADD COLUMN updated_by uuid REFERENCES auth.users(id);
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'portfolio' 
          AND column_name = 'is_archived' 
          AND table_schema = 'public'
        ) THEN
          ALTER TABLE portfolio ADD COLUMN is_archived boolean DEFAULT false NOT NULL;
        END IF;
      END $$;

      -- Create indexes for better performance on new fields
      CREATE INDEX IF NOT EXISTS portfolio_created_by_idx ON portfolio(created_by);
      CREATE INDEX IF NOT EXISTS portfolio_updated_by_idx ON portfolio(updated_by);
      CREATE INDEX IF NOT EXISTS portfolio_archived_idx ON portfolio(is_archived);
      CREATE INDEX IF NOT EXISTS portfolio_active_status_idx ON portfolio(is_archived, is_published, is_draft);

      -- Update existing records to set created_by for historical data
      -- This will set created_by to the first admin user for existing records
      UPDATE portfolio 
      SET created_by = (
        SELECT id FROM users WHERE role = 'admin' ORDER BY created_at LIMIT 1
      )
      WHERE created_by IS NULL;

      -- Create trigger function to automatically set updated_by on updates
      CREATE OR REPLACE FUNCTION set_updated_by_on_portfolio()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_by = auth.uid();
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create trigger for updated_by (replaces the simple updated_at trigger)
      DROP TRIGGER IF EXISTS update_portfolio_updated_at ON portfolio;
      CREATE TRIGGER set_portfolio_updated_by
        BEFORE UPDATE ON portfolio
        FOR EACH ROW
        EXECUTE FUNCTION set_updated_by_on_portfolio();

      -- Create trigger function to automatically set created_by on inserts
      CREATE OR REPLACE FUNCTION set_created_by_on_portfolio()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.created_by = auth.uid();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create trigger for created_by
      CREATE TRIGGER set_portfolio_created_by
        BEFORE INSERT ON portfolio
        FOR EACH ROW
        EXECUTE FUNCTION set_created_by_on_portfolio();

      -- Update RLS policies to handle archived items
      -- Admins can see all items (including archived)
      -- Public can only see published, non-archived items

      -- Drop existing policies
      DROP POLICY IF EXISTS "Portfolio projects are viewable by everyone." ON portfolio;
      DROP POLICY IF EXISTS "Published portfolio projects are viewable by everyone." ON portfolio;
      DROP POLICY IF EXISTS "Admins can view all portfolio projects." ON portfolio;
      DROP POLICY IF EXISTS "Only admins can insert portfolio projects." ON portfolio;
      DROP POLICY IF EXISTS "Only admins can update portfolio projects." ON portfolio;
      DROP POLICY IF EXISTS "Only admins can delete portfolio projects." ON portfolio;

      -- Public can only view published, non-archived portfolio projects
      CREATE POLICY "Published portfolio projects are viewable by everyone."
        ON portfolio FOR SELECT
        USING (is_published = true AND is_archived = false);

      -- Admins can view all portfolio projects (including archived and drafts)
      CREATE POLICY "Admins can view all portfolio projects."
        ON portfolio FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
          )
        );

      -- Only admins can insert portfolio projects
      CREATE POLICY "Only admins can insert portfolio projects."
        ON portfolio FOR INSERT
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
          )
        );

      -- Only admins can update portfolio projects
      CREATE POLICY "Only admins can update portfolio projects."
        ON portfolio FOR UPDATE
        USING (
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
          )
        );

      -- Only admins can delete portfolio projects (soft delete via is_archived)
      CREATE POLICY "Only admins can delete portfolio projects."
        ON portfolio FOR DELETE
        USING (
          EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid() AND users.role = 'admin'
          )
        );
    `;

    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (migrationError) {
      return NextResponse.json({ 
        error: 'Migration failed', 
        details: migrationError.message 
      }, { status: 500 });
    }

    // Verify the migration was successful
    const verifySQL = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'portfolio' 
      AND column_name IN ('created_by', 'updated_by', 'is_archived')
      AND table_schema = 'public'
      ORDER BY column_name;
    `;

    const { data: verificationData, error: verificationError } = await supabase
      .rpc('exec_sql', { sql: verifySQL });

    if (verificationError) {
      console.warn('Verification failed:', verificationError);
    }

    // Get count of updated records
    const { data: counts } = await supabase
      .from('portfolio')
      .select('is_published, is_draft, is_archived')
      .then(result => {
        if (result.error) return { data: null };
        const published = result.data?.filter(item => item.is_published && !item.is_archived).length || 0;
        const drafts = result.data?.filter(item => item.is_draft && !item.is_archived).length || 0;
        const archived = result.data?.filter(item => item.is_archived).length || 0;
        return { data: { published, drafts, archived, total: result.data?.length || 0 } };
      });

    return NextResponse.json({
      success: true,
      message: 'Portfolio user tracking and archive migration completed successfully',
      verification: verificationData || null,
      counts: counts || null,
      appliedChanges: {
        addedColumns: !hasCreatedBy || !hasUpdatedBy || !hasIsArchived,
        createdIndexes: true,
        addedTriggers: true,
        updatedPolicies: true,
        updatedRecords: true
      }
    });

  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error during migration',
      message: error.message
    }, { status: 500 });
  }
} 