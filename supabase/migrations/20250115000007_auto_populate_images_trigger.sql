-- Auto-populate portfolio images from storage directories
-- This trigger function automatically syncs the before_images and after_images arrays
-- with the actual files stored in the portfolio/{uuid}/before_images/ and portfolio/{uuid}/after_images/ directories

-- Function to get images from storage directory
CREATE OR REPLACE FUNCTION get_storage_images(bucket_name TEXT, directory_path TEXT)
RETURNS TEXT[] AS $$
DECLARE
    image_urls TEXT[] := '{}';
    file_record RECORD;
    base_url TEXT;
BEGIN
    -- Get the Supabase project URL for constructing full URLs
    -- You can customize this based on your setup
    base_url := 'https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/' || bucket_name || '/';
    
    -- Get all files from the specified directory
    FOR file_record IN 
        SELECT name 
        FROM storage.objects 
        WHERE bucket_id = bucket_name 
        AND name LIKE directory_path || '%'
        AND name NOT LIKE directory_path || '%/%'  -- Only direct children, not subdirectories
        AND name != directory_path || '.gitkeep'   -- Exclude .gitkeep files
        AND (
            name ILIKE '%.jpg' OR 
            name ILIKE '%.jpeg' OR 
            name ILIKE '%.png' OR 
            name ILIKE '%.webp' OR 
            name ILIKE '%.gif'
        )
        ORDER BY name
    LOOP
        image_urls := array_append(image_urls, base_url || file_record.name);
    END LOOP;
    
    RETURN image_urls;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-populate portfolio images
CREATE OR REPLACE FUNCTION auto_populate_portfolio_images()
RETURNS TRIGGER AS $$
DECLARE
    before_imgs TEXT[];
    after_imgs TEXT[];
BEGIN
    -- Only proceed if this is an INSERT or if the ID has changed
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.id != NEW.id) THEN
        -- Get before images from storage
        before_imgs := get_storage_images('portfolio', NEW.id::TEXT || '/before_images/');
        
        -- Get after images from storage
        after_imgs := get_storage_images('portfolio', NEW.id::TEXT || '/after_images/');
        
        -- Update the arrays
        NEW.before_images := before_imgs;
        NEW.after_images := after_imgs;
        
        RAISE NOTICE 'Auto-populated images for portfolio %: % before images, % after images', 
                     NEW.id, array_length(before_imgs, 1), array_length(after_imgs, 1);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-populating images
DROP TRIGGER IF EXISTS auto_populate_images_trigger ON portfolio;
CREATE TRIGGER auto_populate_images_trigger
    BEFORE INSERT OR UPDATE ON portfolio
    FOR EACH ROW
    EXECUTE FUNCTION auto_populate_portfolio_images();

-- Function to manually refresh all portfolio images (useful for existing records)
CREATE OR REPLACE FUNCTION refresh_all_portfolio_images()
RETURNS INTEGER AS $$
DECLARE
    portfolio_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR portfolio_record IN SELECT id FROM portfolio
    LOOP
        UPDATE portfolio 
        SET updated_at = now()  -- This will trigger the auto-populate function
        WHERE id = portfolio_record.id;
        
        updated_count := updated_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Refreshed images for % portfolio items', updated_count;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to manually refresh a single portfolio item's images
CREATE OR REPLACE FUNCTION refresh_portfolio_images(portfolio_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE portfolio 
    SET updated_at = now()  -- This will trigger the auto-populate function
    WHERE id = portfolio_uuid;
    
    IF FOUND THEN
        RAISE NOTICE 'Refreshed images for portfolio %', portfolio_uuid;
        RETURN TRUE;
    ELSE
        RAISE NOTICE 'Portfolio % not found', portfolio_uuid;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_storage_images(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_all_portfolio_images() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_portfolio_images(UUID) TO authenticated;

-- Add comments for documentation
COMMENT ON FUNCTION get_storage_images(TEXT, TEXT) IS 'Retrieves image URLs from a storage directory path';
COMMENT ON FUNCTION auto_populate_portfolio_images() IS 'Trigger function that automatically populates before_images and after_images arrays from storage';
COMMENT ON FUNCTION refresh_all_portfolio_images() IS 'Manually refresh image arrays for all portfolio items';
COMMENT ON FUNCTION refresh_portfolio_images(UUID) IS 'Manually refresh image arrays for a specific portfolio item';

-- Refresh existing portfolio items to populate their images
SELECT refresh_all_portfolio_images(); 