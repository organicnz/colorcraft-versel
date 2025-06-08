-- Add user tracking and archive functionality to portfolio table
-- This migration adds created_by, updated_by, and is_archived fields

-- Add created_by, updated_by, and is_archived columns to portfolio table
ALTER TABLE portfolio 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false NOT NULL;

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