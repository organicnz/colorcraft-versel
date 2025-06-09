-- Add status field to portfolio table
-- This consolidates the individual boolean fields into a single status field

-- Add the status column with a default value
ALTER TABLE portfolio 
ADD COLUMN status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived'));

-- Update existing records based on current boolean fields
UPDATE portfolio SET status = CASE
  WHEN is_archived = true THEN 'archived'
  WHEN is_draft = true THEN 'draft'
  WHEN is_published = true OR is_published IS NULL THEN 'published'
  ELSE 'published'
END;

-- Make status NOT NULL after setting values
ALTER TABLE portfolio ALTER COLUMN status SET NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_status ON portfolio(status);

-- Add index for status + created_at for sorting
CREATE INDEX IF NOT EXISTS idx_portfolio_status_created_at ON portfolio(status, created_at);

-- Optionally, we can keep the boolean fields for backward compatibility
-- Or drop them if we want to fully migrate to the status field
-- For now, let's keep them for backward compatibility

-- Add comment to document the status field
COMMENT ON COLUMN portfolio.status IS 'Portfolio project status: published (public), draft (work in progress), archived (hidden)'; 