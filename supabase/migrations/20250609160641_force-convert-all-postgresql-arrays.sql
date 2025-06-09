-- Force convert ALL PostgreSQL array format strings to proper JSON arrays
-- This migration uses a more comprehensive approach to handle all edge cases

-- Create a function to safely convert PostgreSQL array strings to JSON
CREATE OR REPLACE FUNCTION convert_pg_array_to_json_array(input_text TEXT)
RETURNS JSONB AS $$
DECLARE
    clean_text TEXT;
    items TEXT[];
    result JSONB;
BEGIN
    -- Handle NULL or empty values
    IF input_text IS NULL OR input_text = '' THEN
        RETURN '[]'::jsonb;
    END IF;
    
    -- Handle empty PostgreSQL arrays
    IF input_text = '{}' THEN
        RETURN '[]'::jsonb;
    END IF;
    
    -- If it's already a JSON array, return as-is
    IF input_text ~ '^\[.*\]$' THEN
        BEGIN
            RETURN input_text::jsonb;
        EXCEPTION WHEN OTHERS THEN
            -- If JSON parsing fails, treat as PostgreSQL array
        END;
    END IF;
    
    -- Handle PostgreSQL array format {item1,item2,item3}
    IF input_text ~ '^{.*}$' THEN
        -- Remove the curly braces
        clean_text := substring(input_text from 2 for length(input_text) - 2);
        
        -- Handle empty content after removing braces
        IF clean_text = '' THEN
            RETURN '[]'::jsonb;
        END IF;
        
        -- Split by comma and build JSON array
        items := string_to_array(clean_text, ',');
        
        -- Build proper JSON array
        SELECT jsonb_agg(trim(item)) INTO result
        FROM unnest(items) AS item
        WHERE trim(item) != '';
        
        RETURN COALESCE(result, '[]'::jsonb);
    END IF;
    
    -- If none of the above patterns match, treat as single item
    RETURN jsonb_build_array(input_text);
END;
$$ LANGUAGE plpgsql;

-- Convert after_images for all records
UPDATE portfolio 
SET after_images = convert_pg_array_to_json_array(after_images::text);

-- Convert before_images for all records  
UPDATE portfolio 
SET before_images = convert_pg_array_to_json_array(before_images::text);

-- Drop the helper function
DROP FUNCTION convert_pg_array_to_json_array(TEXT);
