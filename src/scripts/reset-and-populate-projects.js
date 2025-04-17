// Script to reset the projects table and populate it with sample data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or API key is missing');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Found' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Found' : 'Missing');
  process.exit(1);
}

let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client initialized.');
} catch (initError) {
  console.error('Error initializing Supabase client:');
  console.error(initError);
  process.exit(1);
}

// Sample projects to insert
const sampleProjects = [
  {
    title: 'Vintage Dresser Restoration',
    brief_description: 'Complete restoration of a mid-century dresser with custom hand-painted details.',
    description: 'This vintage dresser was completely stripped, sanded, and refinished. The original hardware was cleaned and polished. Custom hand-painted details were added to the drawer fronts.',
    client_name: 'Maria Santiago',
    before_images: ['https://images.unsplash.com/photo-1517281749396-564b95a206c3'],
    after_images: ['https://images.unsplash.com/photo-1599327286062-40b0a7370fc8'],
    techniques: ['Sanding', 'Staining', 'Hand-painting', 'Refinishing'],
    materials: ['Oak', 'Low-VOC paint', 'Natural stain', 'Brass hardware'],
    completion_date: '2023-06-15',
    client_testimonial: 'The transformation is incredible! My grandmother\'s dresser looks better than new.',
    is_featured: true
  },
  {
    title: 'Mid-Century Console Revival',
    brief_description: 'Transformation of a damaged console into a stunning media center.',
    description: 'This console was in poor condition with water damage and missing veneer. We repaired the structure, replaced the veneer, and refinished it with a durable topcoat.',
    client_name: 'James Wilson',
    before_images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2'],
    after_images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd'],
    techniques: ['Veneer repair', 'Color matching', 'French polishing'],
    materials: ['Walnut veneer', 'Shellac', 'Brass pulls'],
    completion_date: '2023-08-20',
    client_testimonial: 'Incredible work! Our damaged console now looks like a designer piece.',
    is_featured: true
  },
  {
    title: 'Antique Dining Chairs Set',
    brief_description: 'Restoration of four antique dining chairs with custom upholstery.',
    description: 'These family heirloom chairs required structural repair, refinishing of the wood frames, and custom upholstery work. We preserved the original patina while ensuring the chairs are sturdy and comfortable for daily use.',
    client_name: 'Emily Thompson',
    before_images: ['https://images.unsplash.com/photo-1581539250439-c96689b516dd'],
    after_images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2'],
    techniques: ['Joinery repair', 'Upholstery', 'Tufting', 'Wood restoration'],
    materials: ['Beech wood', 'Linen fabric', 'Cotton batting', 'Brass tacks'],
    completion_date: '2023-09-10',
    is_featured: false
  },
  {
    title: 'Rustic Coffee Table',
    brief_description: 'Custom-built coffee table using reclaimed barn wood.',
    description: 'This coffee table was built from the ground up using reclaimed wood from a 100-year-old barn. We preserved the weathered character while creating a functional and stable piece.',
    client_name: 'David Brown',
    before_images: ['https://images.unsplash.com/photo-1600566752355-35792bedcfea'],
    after_images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267'],
    techniques: ['Joinery', 'Epoxy fill', 'Hand planing', 'Custom finishing'],
    materials: ['Reclaimed pine', 'Steel base', 'Epoxy', 'Matte polyurethane'],
    completion_date: '2023-10-05',
    client_testimonial: 'The table is absolutely stunning and has become the centerpiece of our living room.',
    is_featured: true
  },
  {
    title: 'Coastal Sideboard',
    brief_description: 'Beach-inspired makeover of a vintage sideboard with custom wave design.',
    description: 'This vintage sideboard was transformed with a coastal theme, featuring a hand-painted wave design and custom-mixed blue and white colors to evoke the sea.',
    client_name: 'Sarah Miller',
    before_images: ['https://images.unsplash.com/photo-1600210491892-03d54c0aaf87'],
    after_images: ['https://images.unsplash.com/photo-1617104551722-3b2d52b18be1'],
    techniques: ['Chalk painting', 'Distressing', 'Hand painting', 'Glazing'],
    materials: ['Mahogany', 'Chalk paint', 'Artist acrylics', 'Wax finish'],
    completion_date: '2023-11-15',
    is_featured: false
  }
];

async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    const { data: projects, error } = await supabase.from('projects').select('*').limit(1);
    
    if (error) {
      console.error('Error connecting to database:');
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Error name:', error.name);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      return false;
    }
    
    console.log(`Connection successful! Found ${projects?.length ?? 0} projects in database`);
    return true;
  } catch (err) {
    console.error('Exception during connection test:');
    console.error(err);
    console.error('Stack trace:', err.stack);
    return false;
  }
}

async function deleteAllProjects() {
  console.log('Deleting all existing projects...');
  
  try {
    // First, check how many projects exist
    const { data: existingProjects, error: countError } = await supabase
      .from('projects')
      .select('id');
    
    if (countError) {
      console.error('Error counting existing projects:', countError);
      return false;
    }
    
    console.log(`Found ${existingProjects.length} existing projects to delete`);
    
    if (existingProjects.length === 0) {
      console.log('No projects to delete');
      return true;
    }
    
    // Delete all projects - Supabase requires a WHERE clause
    // Using a condition that will match all records
    const { error } = await supabase
      .from('projects')
      .delete()
      .filter('id', 'not.is', null);
    
    if (error) {
      console.error('Error deleting projects:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return false;
    }
    
    // Verify deletion was successful
    const { data: remainingProjects, error: verifyError } = await supabase
      .from('projects')
      .select('id');
      
    if (verifyError) {
      console.error('Error verifying deletion:', verifyError);
      return false;
    }
    
    if (remainingProjects.length > 0) {
      console.error(`Warning: ${remainingProjects.length} projects still remain after deletion attempt`);
      console.error('Remaining project IDs:', remainingProjects.map(p => p.id));
      return false;
    }
    
    console.log('All projects deleted successfully');
    return true;
  } catch (err) {
    console.error('Exception during project deletion:', err);
    return false;
  }
}

async function insertSampleProjects() {
  console.log(`Inserting ${sampleProjects.length} sample projects...`);
  
  try {
    for (const project of sampleProjects) {
      console.log(`Inserting project: ${project.title}`);
      
      const { data, error } = await supabase.from('projects').insert([project]);
      
      if (error) {
        console.error(`Error inserting project "${project.title}":`, error);
        console.error('Project data:', JSON.stringify(project, null, 2));
        return false;
      }
      
      console.log(`Project "${project.title}" inserted successfully`);
    }
    
    console.log('All sample projects inserted successfully');
    return true;
  } catch (err) {
    console.error('Exception during project insertion:', err);
    return false;
  }
}

async function main() {
  try {
    console.log('Starting reset and populate projects script...');
    
    // Test database connection
    const connectionSuccessful = await testConnection();
    if (!connectionSuccessful) {
      console.error('Failed to connect to database. Exiting.');
      process.exit(1);
    }
    
    // Delete all existing projects
    const deletionSuccessful = await deleteAllProjects();
    if (!deletionSuccessful) {
      console.error('Failed to delete existing projects. Exiting.');
      process.exit(1);
    }
    
    // Insert sample projects
    const insertionSuccessful = await insertSampleProjects();
    if (!insertionSuccessful) {
      console.error('Failed to insert sample projects. Exiting.');
      process.exit(1);
    }
    
    console.log('Reset and populate projects script completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Unhandled error in main function:');
    console.error(err);
    process.exit(1);
  }
}

// Run the script
main(); 