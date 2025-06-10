-- Debug Storage Structure Script
-- Run this in Supabase SQL Editor to see your actual file structure

-- 1. Check all files in portfolio bucket
SELECT 
    name as file_path,
    bucket_id,
    created_at,
    updated_at,
    metadata
FROM storage.objects 
WHERE bucket_id = 'portfolio'
ORDER BY name;

-- 2. Check files that match expected before_images pattern
SELECT 
    name as file_path,
    'before_images' as category,
    created_at
FROM storage.objects 
WHERE bucket_id = 'portfolio'
AND name LIKE '%/before_images/%'
ORDER BY name;

-- 3. Check files that match expected after_images pattern  
SELECT 
    name as file_path,
    'after_images' as category,
    created_at
FROM storage.objects 
WHERE bucket_id = 'portfolio'
AND name LIKE '%/after_images/%'
ORDER BY name;

-- 4. Check files in root (unexpected location)
SELECT 
    name as file_path,
    'root_level' as category,
    created_at
FROM storage.objects 
WHERE bucket_id = 'portfolio'
AND name NOT LIKE '%/%'  -- No slash = root level
ORDER BY name;

-- 5. Test the get_storage_images function with actual paths
-- Replace 'actual-uuid-here' with a real portfolio UUID from your database
SELECT 
    'Testing before_images' as test_name,
    get_storage_images('portfolio', 'actual-uuid-here/before_images/') as found_images;

SELECT 
    'Testing after_images' as test_name,
    get_storage_images('portfolio', 'actual-uuid-here/after_images/') as found_images;

-- 6. Check portfolio records and their current image arrays
SELECT 
    id,
    title,
    array_length(before_images, 1) as before_count,
    array_length(after_images, 1) as after_count,
    before_images,
    after_images
FROM portfolio
ORDER BY created_at DESC
LIMIT 5;

-- 7. Test if storage bucket exists and is accessible
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets 
WHERE id = 'portfolio';

-- Expected file structure should be:
-- portfolio/
--   ├── {uuid-1}/
--   │   ├── before_images/
--   │   │   ├── image1.jpg
--   │   │   └── image2.png
--   │   └── after_images/
--   │       ├── image1.jpg
--   │       └── image2.png
--   └── {uuid-2}/
--       ├── before_images/
--       └── after_images/ 