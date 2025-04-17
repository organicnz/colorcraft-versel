// Script to create a storage bucket and upload placeholder images
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('API Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucketIfNotExists() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      console.error('Error checking buckets:', listError);
      return false;
    }
    
    const portfolioBucket = buckets.find(bucket => bucket.name === 'portfolio');
    
    if (!portfolioBucket) {
      console.log('Portfolio bucket does not exist. Creating...');
      
      const { data, error } = await supabase
        .storage
        .createBucket('portfolio', {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      
      if (error) {
        console.error('Error creating bucket:', error);
        return false;
      }
      
      console.log('Portfolio bucket created successfully');
    } else {
      console.log('Portfolio bucket already exists');
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error creating bucket:', err);
    return false;
  }
}

// Function to create a placeholder image with text
async function createPlaceholderImage(name, folderPath = './temp') {
  try {
    // Create temp folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const filePath = path.join(folderPath, `${name}.txt`);
    
    // Create a text file as a placeholder
    fs.writeFileSync(filePath, `This is a placeholder for ${name} image.`);
    
    return filePath;
  } catch (err) {
    console.error(`Error creating placeholder for ${name}:`, err);
    return null;
  }
}

async function uploadPlaceholders() {
  const bucketCreated = await createBucketIfNotExists();
  
  if (!bucketCreated) {
    console.error('Failed to create or verify bucket. Aborting upload.');
    return;
  }
  
  const placeholders = [
    'bookcase',
    'bookcase-before',
    'dresser',
    'dresser-before',
    'cabinet',
    'cabinet-before',
    'farmhouse-dining-table',
    'table-before',
    'coffee-table',
    'coffee-table-before',
    'sideboard',
    'sideboard-before'
  ];
  
  console.log(`Preparing to upload ${placeholders.length} placeholder images...`);
  
  for (const name of placeholders) {
    const filePath = await createPlaceholderImage(name);
    
    if (!filePath) {
      console.error(`Skipping upload for ${name} due to placeholder creation failure.`);
      continue;
    }
    
    try {
      const fileContent = fs.readFileSync(filePath);
      
      const { data, error } = await supabase
        .storage
        .from('portfolio')
        .upload(`${name}.png`, fileContent, {
          contentType: 'image/png',
          upsert: true
        });
      
      if (error) {
        console.error(`Error uploading ${name}:`, error);
      } else {
        console.log(`Successfully uploaded ${name}.png`);
        
        // Get public URL
        const { data: urlData } = supabase
          .storage
          .from('portfolio')
          .getPublicUrl(`${name}.png`);
        
        console.log(`Public URL: ${urlData.publicUrl}`);
      }
    } catch (err) {
      console.error(`Unexpected error uploading ${name}:`, err);
    } finally {
      // Clean up temp file
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error cleaning up ${filePath}:`, err);
      }
    }
  }
  
  // Clean up temp folder
  try {
    fs.rmdirSync('./temp');
  } catch (err) {
    console.error('Error cleaning up temp folder:', err);
  }
  
  console.log('Placeholder upload process completed.');
}

uploadPlaceholders(); 