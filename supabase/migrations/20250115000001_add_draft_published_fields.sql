-- Add draft and published status fields to portfolio table
-- This migration adds the necessary fields for draft/published workflow

-- Add is_published and is_draft columns to portfolio table
ALTER TABLE portfolio 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS is_draft boolean DEFAULT true NOT NULL;

-- Create indexes for better performance on status queries
CREATE INDEX IF NOT EXISTS portfolio_published_idx ON portfolio(is_published);
CREATE INDEX IF NOT EXISTS portfolio_draft_idx ON portfolio(is_draft);
CREATE INDEX IF NOT EXISTS portfolio_status_idx ON portfolio(is_published, is_draft);

-- Add check constraint to ensure logical consistency (can't be both published and draft)
ALTER TABLE portfolio 
ADD CONSTRAINT portfolio_status_check 
CHECK (NOT (is_published = true AND is_draft = true));

-- Update existing records to have consistent state (published = not draft)
UPDATE portfolio 
SET is_published = CASE WHEN is_featured = true THEN true ELSE false END,
    is_draft = CASE WHEN is_featured = true THEN false ELSE true END
WHERE is_published IS NULL OR is_draft IS NULL; 