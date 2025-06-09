SELECT 
  id, 
  title,
  pg_typeof(after_images) as after_images_type,
  after_images,
  pg_typeof(before_images) as before_images_type,
  before_images
FROM portfolio 
LIMIT 3; 