import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    // Check admin authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check if status column already exists
    const { data: existingColumns } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'portfolio'
        AND column_name = 'status'
      `
    });

    const hasStatus = existingColumns?.some((row: any) => row.column_name === 'status');

    if (hasStatus) {
      return NextResponse.json({
        success: true,
        message: 'Status column already exists',
        migration_needed: false,
        existing_columns: existingColumns
      });
    }

    // Add status column and migrate data
    const migrationSQL = `
      -- Add status column to portfolio table
      ALTER TABLE portfolio 
      ADD COLUMN IF NOT EXISTS status text 
      CHECK (status IN ('published', 'draft', 'archived')) 
      DEFAULT 'draft' NOT NULL;

      -- Migrate existing data from boolean fields to status field
      UPDATE portfolio 
      SET status = CASE 
        WHEN COALESCE(is_archived, false) = true THEN 'archived'
        WHEN COALESCE(is_published, false) = true THEN 'published'
        ELSE 'draft'
      END
      WHERE status = 'draft'; -- Only update records that haven't been migrated

      -- Create index for better performance
      CREATE INDEX IF NOT EXISTS portfolio_status_idx ON portfolio(status);

      -- Add a composite index for common queries
      CREATE INDEX IF NOT EXISTS portfolio_status_created_idx ON portfolio(status, created_at);
    `;

    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (migrationError) {
      console.error('Migration error:', migrationError);
      return NextResponse.json({
        success: false,
        error: 'Migration failed',
        details: migrationError.message,
        sql: migrationSQL
      }, { status: 500 });
    }

    // Verify the migration by checking portfolio data
    const { data: portfolioData, error: selectError } = await supabase
      .from('portfolio')
      .select('id, title, status, is_published, is_draft, is_archived')
      .limit(10);

    if (selectError) {
      console.error('Verification error:', selectError);
    }

    // Get status distribution
    const { data: statusCounts } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT status, COUNT(*) as count
        FROM portfolio
        GROUP BY status
        ORDER BY status
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Portfolio status migration completed successfully',
      verification: {
        sample_data: portfolioData,
        status_distribution: statusCounts,
        select_error: selectError?.message || null
      },
      migration_steps: [
        'Added status column with CHECK constraint',
        'Migrated data from boolean fields to status field',
        'Created performance indexes'
      ],
      next_steps: [
        'Update application code to use status field',
        'Remove boolean field dependencies',
        'Consider dropping old boolean columns after testing'
      ]
    });

  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      message: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    description: 'Portfolio Status Migration API',
    usage: 'POST to apply migration that adds status field and migrates from boolean fields',
    endpoints: {
      'POST /api/migrate-portfolio-status': 'Apply the migration'
    },
    migration_details: {
      adds: ['status column with CHECK constraint', 'performance indexes'],
      migrates: 'Boolean fields (is_published, is_draft, is_archived) → status field',
      values: ['published', 'draft', 'archived']
    }
  });
} 