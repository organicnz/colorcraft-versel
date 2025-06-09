-- Force convert all remaining PostgreSQL array data to proper JSON arrays
-- This migration handles all edge cases and ensures all data is properly converted

-- Update all records where after_images is still in PostgreSQL array format
UPDATE portfolio 
SET after_images = CASE 
  -- Handle PostgreSQL array format: {item1,item2}
  WHEN after_images::text ~ '^{.*}$' THEN (
    CASE 
      WHEN after_images::text = '{}' THEN '[]'::jsonb
      ELSE (
        SELECT jsonb_agg(trim(item))
        FROM unnest(string_to_array(
          substring(after_images::text from 2 for length(after_images::text) - 2), 
          ','
        )) AS item
        WHERE trim(item) != ''
      )
    END
  )
  -- Handle null or empty
  WHEN after_images IS NULL THEN '[]'::jsonb
  -- If already JSON array, keep as is
  ELSE after_images
END
WHERE after_images::text ~ '^{.*}$' OR after_images IS NULL;

-- Update all records where before_images is still in PostgreSQL array format
UPDATE portfolio 
SET before_images = CASE 
  -- Handle PostgreSQL array format: {item1,item2}
  WHEN before_images::text ~ '^{.*}$' THEN (
    CASE 
      WHEN before_images::text = '{}' THEN '[]'::jsonb
      ELSE (
        SELECT jsonb_agg(trim(item))
        FROM unnest(string_to_array(
          substring(before_images::text from 2 for length(before_images::text) - 2), 
          ','
        )) AS item
        WHERE trim(item) != ''
      )
    END
  )
  -- Handle null or empty
  WHEN before_images IS NULL THEN '[]'::jsonb
  -- If already JSON array, keep as is
  ELSE before_images
END
WHERE before_images::text ~ '^{.*}$' OR before_images IS NULL;
