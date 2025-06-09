-- Final cleanup of any remaining PostgreSQL array format strings
-- Simple approach to convert remaining {item1,item2} format to ["item1","item2"]

-- Handle after_images
UPDATE portfolio 
SET after_images = CASE 
  -- Convert {item1,item2} to ["item1","item2"]
  WHEN after_images::text ~ '^{.+}$' THEN
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
  -- Convert {} to []
  WHEN after_images::text = '{}' THEN '[]'::jsonb
  -- Convert NULL to []
  WHEN after_images IS NULL THEN '[]'::jsonb
  -- Keep existing JSON arrays as-is
  ELSE after_images
END
WHERE after_images::text ~ '^{.*}$' OR after_images IS NULL;

-- Handle before_images
UPDATE portfolio 
SET before_images = CASE 
  -- Convert {item1,item2} to ["item1","item2"]
  WHEN before_images::text ~ '^{.+}$' THEN
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
  -- Convert {} to []
  WHEN before_images::text = '{}' THEN '[]'::jsonb
  -- Convert NULL to []
  WHEN before_images IS NULL THEN '[]'::jsonb
  -- Keep existing JSON arrays as-is
  ELSE before_images
END
WHERE before_images::text ~ '^{.*}$' OR before_images IS NULL;
