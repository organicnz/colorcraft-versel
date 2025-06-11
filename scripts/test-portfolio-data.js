#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testPortfolioData() {
  console.log('🎨 Testing portfolio data and pagination...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }
  
  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('📊 Fetching all portfolio projects...');
    
    // Test basic table access
    const { data: allProjects, error: allError } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ Error fetching all projects:', allError);
      console.log('💡 This table might not exist yet');
      return;
    }
    
    console.log(`✅ Found ${allProjects.length} total projects`);
    allProjects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.title} - Status: ${project.status} - Featured: ${project.is_featured}`);
    });
    
    // Test published projects specifically
    console.log('\n📢 Fetching published projects...');
    
    const { data: publishedProjects, error: publishedError } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (publishedError) {
      console.error('❌ Error fetching published projects:', publishedError);
      return;
    }
    
    console.log(`✅ Found ${publishedProjects.length} published projects`);
    publishedProjects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.title}`);
      console.log(`     Status: ${project.status}`);
      console.log(`     Featured: ${project.is_featured}`);
      console.log(`     Techniques: ${project.techniques?.join(', ') || 'None'}`);
      console.log(`     After Images: ${project.after_images?.length || 0}`);
      console.log('');
    });
    
    // Test pagination simulation
    console.log('📖 Testing pagination logic...');
    const projectsPerPage = 6;
    const totalPages = Math.ceil(publishedProjects.length / projectsPerPage);
    
    console.log(`Total projects: ${publishedProjects.length}`);
    console.log(`Projects per page: ${projectsPerPage}`);
    console.log(`Total pages: ${totalPages}`);
    
    for (let page = 1; page <= totalPages; page++) {
      const startIndex = (page - 1) * projectsPerPage;
      const endIndex = page * projectsPerPage;
      const pageProjects = publishedProjects.slice(0, endIndex);
      const remaining = publishedProjects.length - pageProjects.length;
      
      console.log(`Page ${page}: Showing ${pageProjects.length} projects, ${remaining} remaining`);
    }
    
    // Test with anon key (what the frontend uses)
    console.log('\n🔑 Testing with anon key (frontend access)...');
    
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data: anonProjects, error: anonError } = await anonSupabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (anonError) {
      console.error('❌ Error with anon key access:', anonError);
      console.log('💡 This might be why the frontend is showing fallback data');
    } else {
      console.log(`✅ Anon key access works! Found ${anonProjects.length} published projects`);
    }
    
    console.log('\n🎉 Portfolio data test completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testPortfolioData(); 