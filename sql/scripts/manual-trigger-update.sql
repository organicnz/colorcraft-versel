-- Manual Trigger Function Update
-- Copy and paste this into Supabase SQL Editor to update the trigger function manually

-- Current trigger function (you can modify this as needed)
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

-- Recreate the trigger (if needed)
DROP TRIGGER IF EXISTS auto_populate_images_trigger ON portfolio;
CREATE TRIGGER auto_populate_images_trigger
    BEFORE INSERT OR UPDATE ON portfolio
    FOR EACH ROW
    EXECUTE FUNCTION auto_populate_portfolio_images();

-- Test the function manually (replace with actual portfolio UUID)
-- SELECT refresh_portfolio_images('your-portfolio-uuid-here');

-- Check current function
-- SELECT routine_name, routine_definition 
-- FROM information_schema.routines 
-- WHERE routine_name = 'auto_populate_portfolio_images';

-- Example modifications you might want to make:

/*
-- Option 1: Always refresh on any UPDATE (not just when updated_at changes)
-- Change this line:
IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (OLD.id != NEW.id OR OLD.updated_at != NEW.updated_at)) THEN
-- To this:
IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN

-- Option 2: Only refresh if certain fields change
-- Add more specific conditions:
IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (
    OLD.id != NEW.id OR 
    OLD.title != NEW.title OR 
    OLD.updated_at != NEW.updated_at
)) THEN

-- Option 3: Skip refresh if images arrays are already populated
-- Add this condition:
IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND (
    array_length(NEW.before_images, 1) IS NULL OR 
    array_length(NEW.after_images, 1) IS NULL OR
    OLD.updated_at != NEW.updated_at
)) THEN

-- Option 4: Add more detailed error logging
-- In the EXCEPTION block, you could add:
EXCEPTION
    WHEN OTHERS THEN
        INSERT INTO portfolio_trigger_log (portfolio_id, error_message, occurred_at) 
        VALUES (NEW.id, SQLERRM, now());
        RAISE WARNING 'Error in auto_populate_portfolio_images for %: %', NEW.id, SQLERRM;
        RETURN NEW;
*/ 