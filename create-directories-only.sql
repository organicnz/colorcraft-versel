-- Simple script to create before_images/after_images directories for existing portfolio items
-- Run this in Supabase Dashboard > SQL Editor

-- Create directories for existing portfolio items with before_images/after_images structure
DO $$
DECLARE
  portfolio_record RECORD;
  admin_user_id UUID;
BEGIN
  -- Get the first admin user to use as owner
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE id IN (
    SELECT id FROM users WHERE role = 'admin'
  ) 
  LIMIT 1;
  
  -- If no admin user found, use the first user
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
  END IF;
  
  -- Create directories for all existing portfolio items
  FOR portfolio_record IN 
    SELECT id, title FROM portfolio
  LOOP
    RAISE NOTICE 'Creating directories for portfolio item: % (%)', portfolio_record.title, portfolio_record.id;
    
    -- Insert .gitkeep files to create before_images/ directory structure
    INSERT INTO storage.objects (bucket_id, name, owner_id, path_tokens)
    VALUES (
      'portfolio',
      portfolio_record.id::TEXT || '/before_images/.gitkeep',
      admin_user_id,
      ARRAY[portfolio_record.id::TEXT, 'before_images', '.gitkeep']
    )
    ON CONFLICT (bucket_id, name) DO NOTHING;
    
    -- Insert .gitkeep files to create after_images/ directory structure
    INSERT INTO storage.objects (bucket_id, name, owner_id, path_tokens)
    VALUES (
      'portfolio',
      portfolio_record.id::TEXT || '/after_images/.gitkeep',
      admin_user_id,
      ARRAY[portfolio_record.id::TEXT, 'after_images', '.gitkeep']
    )
    ON CONFLICT (bucket_id, name) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Created before_images/ and after_images/ directories for existing portfolio items';
END;
$$;

-- Verify the created directories
SELECT 
  name,
  path_tokens,
  created_at
FROM storage.objects 
WHERE bucket_id = 'portfolio' 
  AND name LIKE '%/.gitkeep'
ORDER BY name; 