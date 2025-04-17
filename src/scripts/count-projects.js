const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function countProjects() {
  console.log('Counting projects in the database...');
  const { data, error, count } = await supabase
    .from('projects')
    .select('*', { count: 'exact' });
  
  if (error) {
    console.error('Error fetching projects:', error);
    return;
  }
  
  console.log(`Found ${data.length} projects in the database`);
  console.log('Project titles:');
  data.forEach(project => console.log(`- ${project.title} (featured: ${project.is_featured})`));
}

countProjects(); 