-- Final conversion of remaining PostgreSQL array strings to JSON arrays
-- This migration specifically handles records that are still in {value} or {value1,value2} format

-- Convert any remaining PostgreSQL array format strings to JSON arrays
UPDATE portfolio 
SET after_images = CASE 
  -- Check if it's still in PostgreSQL array format (starts with { and ends with })
  WHEN after_images::text ~ '^{.*}$' THEN 
    CASE 
      -- Handle empty arrays
      WHEN after_images::text = '{}' THEN '[]'::jsonb
      -- Handle single item: {item} -> ["item"]
      WHEN after_images::text !~ ',' THEN 
        jsonb_build_array(substring(after_images::text from 2 for length(after_images::text) - 2))
      -- Handle multiple items: {item1,item2} -> ["item1","item2"]
      ELSE 
        (
          SELECT jsonb_agg(trim(item))
          FROM unnest(
            string_to_array(
              substring(after_images::text from 2 for length(after_images::text) - 2), 
              ','
            )
          ) AS item
          WHERE trim(item) != ''
        )
    END
  ELSE after_images
END
WHERE after_images::text ~ '^{.*}$';

-- Do the same for before_images
UPDATE portfolio 
SET before_images = CASE 
  -- Check if it's still in PostgreSQL array format (starts with { and ends with })
  WHEN before_images::text ~ '^{.*}$' THEN 
    CASE 
      -- Handle empty arrays
      WHEN before_images::text = '{}' THEN '[]'::jsonb
      -- Handle single item: {item} -> ["item"]
      WHEN before_images::text !~ ',' THEN 
        jsonb_build_array(substring(before_images::text from 2 for length(before_images::text) - 2))
      -- Handle multiple items: {item1,item2} -> ["item1","item2"]
      ELSE 
        (
          SELECT jsonb_agg(trim(item))
          FROM unnest(
            string_to_array(
              substring(before_images::text from 2 for length(before_images::text) - 2), 
              ','
            )
          ) AS item
          WHERE trim(item) != ''
        )
    END
  ELSE before_images
END
WHERE before_images::text ~ '^{.*}$';
