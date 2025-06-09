-- Force refresh after uploading images to storage
-- Run this after uploading new images to trigger the database update

-- Option 1: Refresh specific portfolio by UUID
UPDATE portfolio 
SET updated_at = now() 
WHERE id = 'your-portfolio-uuid-here';

-- Option 2: Refresh all portfolios that might have new images
UPDATE portfolio 
SET updated_at = now() 
WHERE id IN (
    -- Add your portfolio UUIDs here
    'uuid-1',
    'uuid-2', 
    'uuid-3'
);

-- Option 3: Use the enhanced refresh function for specific portfolio
SELECT * FROM refresh_portfolio_images('your-portfolio-uuid-here');

-- Option 4: Bulk refresh all portfolios
SELECT * FROM refresh_all_portfolio_images();

-- Option 5: Refresh specific portfolio and see detailed results
SELECT 
    success,
    before_count,
    after_count,
    message,
    array_to_string(before_urls, ', ') as before_list,
    array_to_string(after_urls, ', ') as after_list
FROM refresh_portfolio_images('your-portfolio-uuid-here');

-- Check the results after refresh
SELECT 
    id,
    title,
    array_length(before_images, 1) as before_count,
    array_length(after_images, 1) as after_count,
    before_images,
    after_images
FROM portfolio 
WHERE id = 'your-portfolio-uuid-here'; 