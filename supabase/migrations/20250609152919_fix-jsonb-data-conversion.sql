-- Fix JSONB data conversion for portfolio images
-- The previous migration converted column types but didn't properly convert the data
-- This migration converts PostgreSQL array strings like "{url1,url2}" to proper JSON arrays

-- Function to convert PostgreSQL array string to JSON array
CREATE OR REPLACE FUNCTION convert_pg_array_to_json(pg_array_text TEXT)
RETURNS JSONB AS $$
BEGIN
  -- Handle null or empty values
  IF pg_array_text IS NULL OR pg_array_text = '' OR pg_array_text = '{}' THEN
    RETURN '[]'::jsonb;
  END IF;
  
  -- If it's already a JSON array, return as is
  IF pg_array_text::text ~ '^\[.*\]$' THEN
    RETURN pg_array_text::jsonb;
  END IF;
  
  -- Convert PostgreSQL array format {item1,item2} to JSON array
  IF pg_array_text::text ~ '^{.*}$' THEN
    DECLARE
      content TEXT;
      items TEXT[];
      json_array JSONB := '[]'::jsonb;
      item TEXT;
    BEGIN
      -- Remove the curly braces
      content := substring(pg_array_text from 2 for length(pg_array_text) - 2);
      
      -- If empty content, return empty array
      IF content = '' THEN
        RETURN '[]'::jsonb;
      END IF;
      
      -- Split by comma and build JSON array
      items := string_to_array(content, ',');
      
      FOREACH item IN ARRAY items
      LOOP
        -- Trim whitespace and add to JSON array
        item := trim(item);
        IF item != '' THEN
          json_array := json_array || to_jsonb(item);
        END IF;
      END LOOP;
      
      RETURN json_array;
    END;
  END IF;
  
  -- If it's a single item without braces, wrap in array
  RETURN to_jsonb(ARRAY[pg_array_text]);
END;
$$ LANGUAGE plpgsql;

-- Convert existing data
UPDATE portfolio 
SET 
  before_images = convert_pg_array_to_json(before_images::text),
  after_images = convert_pg_array_to_json(after_images::text)
WHERE 
  before_images::text ~ '^{.*}$' OR 
  after_images::text ~ '^{.*}$' OR
  before_images IS NULL OR
  after_images IS NULL;

-- Drop the temporary function
DROP FUNCTION convert_pg_array_to_json(TEXT);
