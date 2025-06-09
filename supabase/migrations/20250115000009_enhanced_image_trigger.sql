-- Enhanced auto-populate portfolio images from storage directories
-- This improved version includes better error handling, storage permissions, and debugging

-- Enhanced function to get images from storage directory with better error handling
CREATE OR REPLACE FUNCTION get_storage_images(bucket_name TEXT, directory_path TEXT)
RETURNS TEXT[] AS $$
DECLARE
    image_urls TEXT[] := '{}';
    file_record RECORD;
    base_url TEXT;
    file_count INTEGER := 0;
BEGIN
    -- Get the Supabase project URL for constructing full URLs
    base_url := 'https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/' || bucket_name || '/';
    
    RAISE NOTICE 'Scanning storage: bucket=%, path=%, base_url=%', bucket_name, directory_path, base_url;
    
    -- Get all files from the specified directory with enhanced filtering
    FOR file_record IN 
        SELECT name, created_at, updated_at
        FROM storage.objects 
        WHERE bucket_id = bucket_name 
        AND name LIKE directory_path || '%'
        AND name NOT LIKE directory_path || '%/%'  -- Only direct children, not subdirectories
        AND name != directory_path || '.gitkeep'   -- Exclude .gitkeep files
        AND name != directory_path || '.DS_Store'  -- Exclude macOS files
        AND (
            name ILIKE '%.jpg' OR 
            name ILIKE '%.jpeg' OR 
            name ILIKE '%.png' OR 
            name ILIKE '%.webp' OR 
            name ILIKE '%.gif' OR
            name ILIKE '%.bmp' OR
            name ILIKE '%.tiff' OR
            name ILIKE '%.svg'
        )
        ORDER BY file_record.created_at ASC, name ASC
    LOOP
        image_urls := array_append(image_urls, base_url || file_record.name);
        file_count := file_count + 1;
        RAISE NOTICE 'Found image: %', file_record.name;
    END LOOP;
    
    RAISE NOTICE 'Total images found in %: %', directory_path, file_count;
    RETURN image_urls;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error accessing storage for %: %', directory_path, SQLERRM;
        RETURN '{}';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced auto-populate function with better debugging
CREATE OR REPLACE FUNCTION auto_populate_portfolio_images()
RETURNS TRIGGER AS $$
DECLARE
    before_imgs TEXT[];
    after_imgs TEXT[];
    before_path TEXT;
    after_path TEXT;
BEGIN
    RAISE NOTICE 'Trigger fired: operation=%, portfolio_id=%', TG_OP, NEW.id;
    
    -- Always refresh images on INSERT, or on UPDATE if explicitly requested
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (OLD.id != NEW.id OR OLD.updated_at != NEW.updated_at)) THEN
        -- Construct paths
        before_path := NEW.id::TEXT || '/before_images/';
        after_path := NEW.id::TEXT || '/after_images/';
        
        RAISE NOTICE 'Refreshing images for portfolio %', NEW.id;
        RAISE NOTICE 'Before path: %', before_path;
        RAISE NOTICE 'After path: %', after_path;
        
        -- Get before images from storage
        before_imgs := get_storage_images('portfolio', before_path);
        
        -- Get after images from storage  
        after_imgs := get_storage_images('portfolio', after_path);
        
        -- Update the arrays
        NEW.before_images := before_imgs;
        NEW.after_images := after_imgs;
        
        RAISE NOTICE 'Auto-populated images for portfolio %: % before images, % after images', 
                     NEW.id, 
                     COALESCE(array_length(before_imgs, 1), 0), 
                     COALESCE(array_length(after_imgs, 1), 0);
                     
        -- Log the actual URLs for debugging
        IF array_length(before_imgs, 1) > 0 THEN
            RAISE NOTICE 'Before images: %', array_to_string(before_imgs, ', ');
        END IF;
        
        IF array_length(after_imgs, 1) > 0 THEN
            RAISE NOTICE 'After images: %', array_to_string(after_imgs, ', ');
        END IF;
    ELSE
        RAISE NOTICE 'Skipping image refresh for portfolio % (no change detected)', NEW.id;
    END IF;
    
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in auto_populate_portfolio_images for %: %', NEW.id, SQLERRM;
        RETURN NEW;  -- Return NEW even on error to not block the operation
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger to ensure it's using the latest function
DROP TRIGGER IF EXISTS auto_populate_images_trigger ON portfolio;
CREATE TRIGGER auto_populate_images_trigger
    BEFORE INSERT OR UPDATE ON portfolio
    FOR EACH ROW
    EXECUTE FUNCTION auto_populate_portfolio_images();

-- Enhanced manual refresh functions with better feedback

-- Drop existing functions to allow return type changes
DROP FUNCTION IF EXISTS refresh_all_portfolio_images();
DROP FUNCTION IF EXISTS refresh_portfolio_images(UUID);

-- Function to manually refresh all portfolio images
CREATE OR REPLACE FUNCTION refresh_all_portfolio_images()
RETURNS TABLE(
    portfolio_id UUID,
    before_count INTEGER,
    after_count INTEGER,
    status TEXT
) AS $$
DECLARE
    portfolio_record RECORD;
    updated_count INTEGER := 0;
    before_imgs TEXT[];
    after_imgs TEXT[];
BEGIN
    RAISE NOTICE 'Starting bulk refresh of all portfolio images...';
    
    FOR portfolio_record IN SELECT id, title FROM portfolio ORDER BY created_at
    LOOP
        BEGIN
            -- Get current images
            before_imgs := get_storage_images('portfolio', portfolio_record.id::TEXT || '/before_images/');
            after_imgs := get_storage_images('portfolio', portfolio_record.id::TEXT || '/after_images/');
            
            -- Update the portfolio record (this will trigger the auto-populate function)
            UPDATE portfolio 
            SET before_images = before_imgs,
                after_images = after_imgs,
                updated_at = now()
            WHERE id = portfolio_record.id;
            
            updated_count := updated_count + 1;
            
            -- Return information about this portfolio
            portfolio_id := portfolio_record.id;
            before_count := COALESCE(array_length(before_imgs, 1), 0);
            after_count := COALESCE(array_length(after_imgs, 1), 0);
            status := 'success';
            
            RETURN NEXT;
            
        EXCEPTION
            WHEN OTHERS THEN
                portfolio_id := portfolio_record.id;
                before_count := 0;
                after_count := 0;
                status := 'error: ' || SQLERRM;
                
                RAISE WARNING 'Error refreshing portfolio %: %', portfolio_record.id, SQLERRM;
                RETURN NEXT;
        END;
    END LOOP;
    
    RAISE NOTICE 'Bulk refresh completed. Processed % portfolio items', updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced single portfolio refresh function
CREATE OR REPLACE FUNCTION refresh_portfolio_images(portfolio_uuid UUID)
RETURNS TABLE(
    success BOOLEAN,
    before_count INTEGER,
    after_count INTEGER,
    message TEXT,
    before_urls TEXT[],
    after_urls TEXT[]
) AS $$
DECLARE
    before_imgs TEXT[];
    after_imgs TEXT[];
    portfolio_exists BOOLEAN;
BEGIN
    -- Check if portfolio exists
    SELECT EXISTS(SELECT 1 FROM portfolio WHERE id = portfolio_uuid) INTO portfolio_exists;
    
    IF NOT portfolio_exists THEN
        success := FALSE;
        before_count := 0;
        after_count := 0;
        message := 'Portfolio not found';
        before_urls := '{}';
        after_urls := '{}';
        RETURN NEXT;
        RETURN;
    END IF;
    
    RAISE NOTICE 'Refreshing images for portfolio %', portfolio_uuid;
    
    BEGIN
        -- Get images from storage
        before_imgs := get_storage_images('portfolio', portfolio_uuid::TEXT || '/before_images/');
        after_imgs := get_storage_images('portfolio', portfolio_uuid::TEXT || '/after_images/');
        
        -- Update the portfolio record
        UPDATE portfolio 
        SET before_images = before_imgs,
            after_images = after_imgs,
            updated_at = now()
        WHERE id = portfolio_uuid;
        
        -- Return success result
        success := TRUE;
        before_count := COALESCE(array_length(before_imgs, 1), 0);
        after_count := COALESCE(array_length(after_imgs, 1), 0);
        message := format('Successfully refreshed: %s before, %s after images', before_count, after_count);
        before_urls := before_imgs;
        after_urls := after_imgs;
        
        RAISE NOTICE 'Refreshed portfolio %: % before, % after images', 
                     portfolio_uuid, before_count, after_count;
        
        RETURN NEXT;
        
    EXCEPTION
        WHEN OTHERS THEN
            success := FALSE;
            before_count := 0;
            after_count := 0;
            message := 'Error: ' || SQLERRM;
            before_urls := '{}';
            after_urls := '{}';
            
            RAISE WARNING 'Error refreshing portfolio %: %', portfolio_uuid, SQLERRM;
            RETURN NEXT;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check storage access and permissions
CREATE OR REPLACE FUNCTION debug_storage_access(portfolio_uuid UUID)
RETURNS TABLE(
    check_name TEXT,
    result TEXT,
    details TEXT
) AS $$
DECLARE
    bucket_exists BOOLEAN;
    before_path TEXT;
    after_path TEXT;
    raw_before_files TEXT;
    raw_after_files TEXT;
BEGIN
    before_path := portfolio_uuid::TEXT || '/before_images/';
    after_path := portfolio_uuid::TEXT || '/after_images/';
    
    -- Check 1: Bucket exists
    SELECT EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'portfolio') INTO bucket_exists;
    check_name := 'bucket_exists';
    result := bucket_exists::TEXT;
    details := 'Portfolio bucket existence check';
    RETURN NEXT;
    
    -- Check 2: Can query storage.objects
    BEGIN
        SELECT string_agg(name, ', ') INTO raw_before_files
        FROM storage.objects 
        WHERE bucket_id = 'portfolio' 
        AND name LIKE before_path || '%'
        LIMIT 10;
        
        check_name := 'before_directory_access';
        result := 'success';
        details := COALESCE('Files: ' || raw_before_files, 'No files found');
        RETURN NEXT;
        
    EXCEPTION
        WHEN OTHERS THEN
            check_name := 'before_directory_access';
            result := 'error';
            details := SQLERRM;
            RETURN NEXT;
    END;
    
    -- Check 3: After directory access
    BEGIN
        SELECT string_agg(name, ', ') INTO raw_after_files
        FROM storage.objects 
        WHERE bucket_id = 'portfolio' 
        AND name LIKE after_path || '%'
        LIMIT 10;
        
        check_name := 'after_directory_access';
        result := 'success';
        details := COALESCE('Files: ' || raw_after_files, 'No files found');
        RETURN NEXT;
        
    EXCEPTION
        WHEN OTHERS THEN
            check_name := 'after_directory_access';
            result := 'error';
            details := SQLERRM;
            RETURN NEXT;
    END;
    
    -- Check 4: Function permissions
    check_name := 'function_permissions';
    result := 'accessible';
    details := 'Function can be called successfully';
    RETURN NEXT;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_storage_images(TEXT, TEXT) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION refresh_all_portfolio_images() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_portfolio_images(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION debug_storage_access(UUID) TO authenticated;

-- Update comments
COMMENT ON FUNCTION get_storage_images(TEXT, TEXT) IS 'Enhanced function to retrieve image URLs from storage directory with error handling';
COMMENT ON FUNCTION auto_populate_portfolio_images() IS 'Enhanced trigger function with debugging and error handling';
COMMENT ON FUNCTION refresh_all_portfolio_images() IS 'Bulk refresh all portfolio images with detailed feedback';
COMMENT ON FUNCTION refresh_portfolio_images(UUID) IS 'Refresh specific portfolio images with detailed feedback';
COMMENT ON FUNCTION debug_storage_access(UUID) IS 'Debug storage access and permissions for a portfolio';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Enhanced image trigger system deployed successfully';
END $$;

-- Run initial refresh to populate existing records
DO $$
DECLARE
    result_record RECORD;
    total_success INTEGER := 0;
    total_error INTEGER := 0;
BEGIN
    RAISE NOTICE 'Running initial refresh of all portfolio images...';
    
    FOR result_record IN SELECT * FROM refresh_all_portfolio_images()
    LOOP
        IF result_record.status = 'success' THEN
            total_success := total_success + 1;
        ELSE
            total_error := total_error + 1;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Initial refresh complete: % successful, % errors', total_success, total_error;
END $$; 