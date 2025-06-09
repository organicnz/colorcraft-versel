-- Convert PostgreSQL array strings to proper JSON arrays
-- This migration handles the remaining data that wasn't properly converted

-- Simple approach: handle the most common PostgreSQL array formats

-- Convert after_images from PostgreSQL array strings to JSON arrays
UPDATE portfolio 
SET after_images = CASE 
  -- Single item in braces: {item} -> ["item"]
  WHEN after_images::text ~ '^{[^,}]+}$' THEN 
    ('["' || substring(after_images::text from 2 for length(after_images::text) - 2) || '"]')::jsonb
  
  -- Multiple items in braces: {item1,item2,item3} -> ["item1","item2","item3"]
  WHEN after_images::text ~ '^{.+,.+}$' THEN 
    ('["' || replace(substring(after_images::text from 2 for length(after_images::text) - 2), ',', '","') || '"]')::jsonb
  
  -- Empty braces: {} -> []
  WHEN after_images::text = '{}' THEN '[]'::jsonb
  
  -- NULL -> []
  WHEN after_images IS NULL THEN '[]'::jsonb
  
  -- Keep existing JSON arrays as-is
  ELSE after_images
END
WHERE after_images::text ~ '^{.*}$' OR after_images IS NULL;

-- Convert before_images from PostgreSQL array strings to JSON arrays  
UPDATE portfolio 
SET before_images = CASE 
  -- Single item in braces: {item} -> ["item"]
  WHEN before_images::text ~ '^{[^,}]+}$' THEN 
    ('["' || substring(before_images::text from 2 for length(before_images::text) - 2) || '"]')::jsonb
  
  -- Multiple items in braces: {item1,item2,item3} -> ["item1","item2","item3"]
  WHEN before_images::text ~ '^{.+,.+}$' THEN 
    ('["' || replace(substring(before_images::text from 2 for length(before_images::text) - 2), ',', '","') || '"]')::jsonb
  
  -- Empty braces: {} -> []
  WHEN before_images::text = '{}' THEN '[]'::jsonb
  
  -- NULL -> []
  WHEN before_images IS NULL THEN '[]'::jsonb
  
  -- Keep existing JSON arrays as-is
  ELSE before_images
END
WHERE before_images::text ~ '^{.*}$' OR before_images IS NULL;
