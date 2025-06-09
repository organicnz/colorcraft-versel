-- Convert before_images and after_images from text[] to jsonb
-- This migration will convert the PostgreSQL text[] arrays to JSONB format
-- for better JavaScript compatibility

-- First, add new JSONB columns
ALTER TABLE portfolio 
ADD COLUMN before_images_jsonb JSONB,
ADD COLUMN after_images_jsonb JSONB;

-- Convert existing text[] data to JSONB
-- Handle the PostgreSQL array format {item1,item2} and convert to JSON array
UPDATE portfolio 
SET 
  before_images_jsonb = CASE 
    WHEN before_images IS NULL OR before_images = '{}' THEN '[]'::jsonb
    ELSE array_to_json(before_images)::jsonb
  END,
  after_images_jsonb = CASE 
    WHEN after_images IS NULL OR after_images = '{}' THEN '[]'::jsonb
    ELSE array_to_json(after_images)::jsonb
  END;

-- Drop the old text[] columns
ALTER TABLE portfolio 
DROP COLUMN before_images,
DROP COLUMN after_images;

-- Rename the new columns to the original names
ALTER TABLE portfolio 
RENAME COLUMN before_images_jsonb TO before_images;

ALTER TABLE portfolio 
RENAME COLUMN after_images_jsonb TO after_images;
