-- Consolidate portfolio status management to use single 'status' field
-- This migration removes the boolean fields (is_published, is_draft, is_archived) 
-- in favor of the single 'status' field with enum-like values

-- First, ensure all existing records have consistent status values
-- Update status based on existing boolean fields if they exist
DO $$
BEGIN
    -- Only update if the boolean columns exist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'portfolio' 
        AND column_name = 'is_archived' 
        AND table_schema = 'public'
    ) THEN
        UPDATE portfolio SET status = CASE
            WHEN is_archived = true THEN 'archived'
            WHEN is_draft = true THEN 'draft'  
            WHEN is_published = true THEN 'published'
            ELSE 'published'  -- Default fallback
        END
        WHERE status IS NULL OR status NOT IN ('published', 'draft', 'archived');
    END IF;
END $$;

-- Drop old triggers that referenced boolean fields
DROP TRIGGER IF EXISTS set_portfolio_updated_by ON portfolio;
DROP TRIGGER IF EXISTS set_portfolio_created_by ON portfolio;

-- Recreate triggers without boolean field dependencies
CREATE OR REPLACE FUNCTION set_updated_by_on_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_by = auth.uid();
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_created_by_on_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_portfolio_updated_by
  BEFORE UPDATE ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_by_on_portfolio();

CREATE TRIGGER set_portfolio_created_by
  BEFORE INSERT ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by_on_portfolio();

-- Update RLS policies to use status field instead of boolean fields
DROP POLICY IF EXISTS "Published portfolio projects are viewable by everyone." ON portfolio;
DROP POLICY IF EXISTS "Admins can view all portfolio projects." ON portfolio;
DROP POLICY IF EXISTS "Only admins can insert portfolio projects." ON portfolio;
DROP POLICY IF EXISTS "Only admins can update portfolio projects." ON portfolio;
DROP POLICY IF EXISTS "Only admins can delete portfolio projects." ON portfolio;

-- Public can only view published portfolio projects
CREATE POLICY "Published portfolio projects are viewable by everyone."
  ON portfolio FOR SELECT
  USING (status = 'published');

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

-- Only admins can delete portfolio projects
CREATE POLICY "Only admins can delete portfolio projects."
  ON portfolio FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Drop old indexes that referenced boolean fields
DROP INDEX IF EXISTS portfolio_published_idx;
DROP INDEX IF EXISTS portfolio_draft_idx;
DROP INDEX IF EXISTS portfolio_status_idx;
DROP INDEX IF EXISTS portfolio_archived_idx;
DROP INDEX IF EXISTS portfolio_active_status_idx;

-- Drop old constraints
ALTER TABLE portfolio DROP CONSTRAINT IF EXISTS portfolio_status_check;

-- Drop the boolean columns (after ensuring data is migrated)
DO $$
BEGIN
    -- Drop is_published column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'portfolio' 
        AND column_name = 'is_published' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE portfolio DROP COLUMN is_published;
    END IF;

    -- Drop is_draft column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'portfolio' 
        AND column_name = 'is_draft' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE portfolio DROP COLUMN is_draft;
    END IF;

    -- Drop is_archived column if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'portfolio' 
        AND column_name = 'is_archived' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE portfolio DROP COLUMN is_archived;
    END IF;
END $$;

-- Ensure status field has proper constraints and defaults
ALTER TABLE portfolio ALTER COLUMN status SET NOT NULL;
ALTER TABLE portfolio ALTER COLUMN status SET DEFAULT 'draft';

-- Add updated constraint for status field
ALTER TABLE portfolio 
ADD CONSTRAINT portfolio_status_check 
CHECK (status IN ('published', 'draft', 'archived'));

-- Ensure we have the optimized indexes for status-based queries
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_status_created_at ON portfolio(status, created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_status_featured ON portfolio(status, is_featured);

-- Add helpful comments
COMMENT ON COLUMN portfolio.status IS 'Portfolio project status: published (visible to public), draft (work in progress), archived (hidden from all views)';
COMMENT ON CONSTRAINT portfolio_status_check ON portfolio IS 'Ensures status is one of: published, draft, archived';

-- Create a helpful function to get portfolio counts by status
CREATE OR REPLACE FUNCTION get_portfolio_status_counts()
RETURNS TABLE(
  status TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.status::TEXT,
    COUNT(*) as count
  FROM portfolio p
  GROUP BY p.status
  ORDER BY p.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_portfolio_status_counts() TO authenticated;

COMMENT ON FUNCTION get_portfolio_status_counts() IS 'Returns count of portfolio items by status';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Portfolio status consolidation completed. Status field is now the single source of truth.';
END $$; 