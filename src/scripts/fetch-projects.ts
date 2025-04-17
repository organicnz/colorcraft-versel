import { createClient } from '@/lib/supabase/server';

export async function fetchProjects() {
  const supabase = createClient();
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch portfolio projects');
  }
  
  console.log('Projects data:', JSON.stringify(projects, null, 2));
  return projects || [];
}

// This will run if executed directly with ts-node
if (require.main === module) {
  fetchProjects()
    .then(projects => {
      console.log(`Found ${projects.length} projects.`);
    })
    .catch(error => {
      console.error('Error:', error);
    });
} 