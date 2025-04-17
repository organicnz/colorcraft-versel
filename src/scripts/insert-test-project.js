// Script to insert a test project
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('API Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test project data
const testProject = {
  title: "Mid-Century Console Revival",
  description: "Restored a 1960s teak console with original brass hardware and a fresh oil finish.",
  brief_description: "Restored a 1960s teak console with original brass hardware and a fresh oil finish.",
  before_images: [
    "https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/bookcase.png"
  ],
  after_images: [
    "https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/bookcase.png"
  ],
  techniques: ["Oil Finish", "Hardware Restoration", "Wood Repair"],
  materials: ["Teak Oil", "Brass Polish", "Wood Filler"],
  completion_date: "2025-04-01",
  is_featured: true
};

async function insertProject() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(testProject)
      .select();

    if (error) {
      console.error('Error inserting project:', error);
      return;
    }

    console.log('Success! Inserted project:', data);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

insertProject(); 