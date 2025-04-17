import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

async function queryProjects() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Service Role Key is missing. Please check your .env.local file.');
    process.exit(1);
  }

  console.log('Connecting to Supabase with service role key...');
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Querying projects table...');
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }
    
    console.log(`Found ${projects?.length || 0} projects:`);
    console.log(JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

queryProjects(); 