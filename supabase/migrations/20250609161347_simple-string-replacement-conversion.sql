-- Simple string replacement conversion from PostgreSQL arrays to JSON arrays
-- Convert {item1,item2} to ["item1","item2"] using basic string replacement

-- Handle after_images conversion
UPDATE portfolio 
SET after_images = CASE 
  -- Handle empty arrays: {} -> []
  WHEN after_images::text = '{}' THEN '[]'::jsonb
  
  -- Handle single item arrays: {item} -> ["item"]
  WHEN after_images::text ~ '^{[^,}]+}$' THEN 
    ('["' || substring(after_images::text from 2 for length(after_images::text) - 2) || '"]')::jsonb
    
  -- Handle multiple item arrays: {item1,item2,item3} -> ["item1","item2","item3"]
  WHEN after_images::text ~ '^{.+,.+}$' THEN 
    ('["' || replace(substring(after_images::text from 2 for length(after_images::text) - 2), ',', '","') || '"]')::jsonb
    
  -- If it's already a JSON array, keep it as is
  ELSE after_images
END
WHERE after_images::text ~ '^{.*}$';

-- Handle before_images conversion
UPDATE portfolio 
SET before_images = CASE 
  -- Handle empty arrays: {} -> []
  WHEN before_images::text = '{}' THEN '[]'::jsonb
  
  -- Handle single item arrays: {item} -> ["item"]
  WHEN before_images::text ~ '^{[^,}]+}$' THEN 
    ('["' || substring(before_images::text from 2 for length(before_images::text) - 2) || '"]')::jsonb
    
  -- Handle multiple item arrays: {item1,item2,item3} -> ["item1","item2","item3"]
  WHEN before_images::text ~ '^{.+,.+}$' THEN 
    ('["' || replace(substring(before_images::text from 2 for length(before_images::text) - 2), ',', '","') || '"]')::jsonb
    
  -- If it's already a JSON array, keep it as is
  ELSE before_images
END
WHERE before_images::text ~ '^{.*}$';

-- Verify the conversion worked
SELECT 
  'Conversion completed' as status,
  COUNT(*) as total_records,
  COUNT(CASE WHEN after_images::text ~ '^{.*}$' THEN 1 END) as remaining_pg_format_after,
  COUNT(CASE WHEN before_images::text ~ '^{.*}$' THEN 1 END) as remaining_pg_format_before
FROM portfolio;
