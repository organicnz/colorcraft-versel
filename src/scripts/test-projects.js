// Simple script to test querying projects
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('API Key (first 10 chars):', supabaseKey.substring(0, 10) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Success! Found', data.length, 'projects:');
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testQuery(); 