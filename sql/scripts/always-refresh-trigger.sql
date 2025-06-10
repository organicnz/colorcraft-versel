-- Modified trigger function that ALWAYS refreshes images on updates
-- This ensures that any portfolio update will scan storage for new images

CREATE OR REPLACE FUNCTION auto_populate_portfolio_images()
RETURNS TRIGGER AS $$
DECLARE
    before_imgs TEXT[];
    after_imgs TEXT[];
    before_path TEXT;
    after_path TEXT;
BEGIN
    RAISE NOTICE 'Trigger fired: operation=%, portfolio_id=%', TG_OP, NEW.id;
    
    -- ALWAYS refresh images on INSERT or ANY UPDATE (removed the condition check)
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
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
        RAISE NOTICE 'Skipping image refresh for portfolio % (operation: %)', NEW.id, TG_OP;
    END IF;
    
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error in auto_populate_portfolio_images for %: %', NEW.id, SQLERRM;
        RETURN NEW;  -- Return NEW even on error to not block the operation
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS auto_populate_images_trigger ON portfolio;
CREATE TRIGGER auto_populate_images_trigger
    BEFORE INSERT OR UPDATE ON portfolio
    FOR EACH ROW
    EXECUTE FUNCTION auto_populate_portfolio_images();

-- Test: Update a portfolio to trigger immediate refresh
-- UPDATE portfolio SET title = title WHERE id = 'your-portfolio-uuid-here'; 