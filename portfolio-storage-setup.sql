-- Portfolio Storage Setup with Before/After Directory Structure
-- Run this in Supabase Dashboard > SQL Editor
-- This script sets up the portfolio storage bucket and all necessary policies

-- 1. Create the portfolio bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Portfolio images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;

-- 3. Create storage policies for the portfolio bucket

-- Policy 1: Public read access for portfolio images
CREATE POLICY "Portfolio images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Policy 2: Admin upload access
CREATE POLICY "Admins can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Policy 3: Admin update access
CREATE POLICY "Admins can update portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Policy 4: Admin delete access
CREATE POLICY "Admins can delete portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- 5. Create directories for existing portfolio items with before/after structure
DO $$
DECLARE
  portfolio_record RECORD;
BEGIN
  -- Create directories for all existing portfolio items
  FOR portfolio_record IN 
    SELECT id FROM portfolio
  LOOP
    -- Insert .gitkeep files to create before/ directory structure
    INSERT INTO storage.objects (bucket_id, name, owner_id, path_tokens)
    VALUES (
      'portfolio',
      portfolio_record.id::TEXT || '/before/.gitkeep',
      (SELECT id FROM auth.users LIMIT 1), -- Use first admin user as owner
      ARRAY[portfolio_record.id::TEXT, 'before', '.gitkeep']
    )
    ON CONFLICT (bucket_id, name) DO NOTHING;
    
    -- Insert .gitkeep files to create after/ directory structure
    INSERT INTO storage.objects (bucket_id, name, owner_id, path_tokens)
    VALUES (
      'portfolio',
      portfolio_record.id::TEXT || '/after/.gitkeep',
      (SELECT id FROM auth.users LIMIT 1), -- Use first admin user as owner
      ARRAY[portfolio_record.id::TEXT, 'after', '.gitkeep']
    )
    ON CONFLICT (bucket_id, name) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Created before/ and after/ directories for existing portfolio items';
END;
$$;

-- 6. Create a function to automatically create portfolio directories with before/after structure
CREATE OR REPLACE FUNCTION create_portfolio_directories(portfolio_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  before_path TEXT;
  after_path TEXT;
BEGIN
  -- Create the directory paths
  before_path := portfolio_uuid::TEXT || '/before/';
  after_path := portfolio_uuid::TEXT || '/after/';
  
  -- Insert placeholder files to create the directory structure
  INSERT INTO storage.objects (bucket_id, name, owner_id, path_tokens)
  VALUES (
    'portfolio',
    before_path || '.gitkeep',
    auth.uid(),
    ARRAY[portfolio_uuid::TEXT, 'before', '.gitkeep']
  )
  ON CONFLICT (bucket_id, name) DO NOTHING;
  
  INSERT INTO storage.objects (bucket_id, name, owner_id, path_tokens)
  VALUES (
    'portfolio',
    after_path || '.gitkeep',
    auth.uid(),
    ARRAY[portfolio_uuid::TEXT, 'after', '.gitkeep']
  )
  ON CONFLICT (bucket_id, name) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the portfolio creation
    RAISE WARNING 'Failed to create portfolio directories for %: %', portfolio_uuid, SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create a trigger function to automatically create directories when portfolio items are created
CREATE OR REPLACE FUNCTION create_portfolio_directory_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Create directories for the new portfolio item
  PERFORM create_portfolio_directories(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to auto-create directories
DROP TRIGGER IF EXISTS create_portfolio_directory_on_insert ON portfolio;
CREATE TRIGGER create_portfolio_directory_on_insert
  AFTER INSERT ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION create_portfolio_directory_trigger();

-- 9. Verify the setup
SELECT 'Portfolio storage setup with before/after directory structure completed successfully!' as status;

-- 10. Show created policies
SELECT 
  policyname,
  roles,
  cmd,
  permissive
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%portfolio%';

-- 11. Example directory structure created:
-- portfolio/
--   ├── {portfolio-uuid-1}/
--   │   ├── before/
--   │   │   └── .gitkeep
--   │   └── after/
--   │       └── .gitkeep
--   └── {portfolio-uuid-2}/
--       ├── before/
--       │   └── .gitkeep
--       └── after/
--           └── .gitkeep 