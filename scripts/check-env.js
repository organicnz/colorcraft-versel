#!/usr/bin/env node

// Simple script to check if Supabase environment variables are configured correctly
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkEnv() {
  console.log('Checking Supabase environment variables...\n');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  // Check URL
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
  } else {
    console.log(`✅ NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl.substring(0, 16)}...`);
  }
  
  // Check Anon Key
  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  } else {
    console.log(`✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey.substring(0, 10)}...`);
  }
  
  // Check Service Role Key
  if (!supabaseServiceKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing');
  } else {
    console.log(`✅ SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey.substring(0, 10)}...`);
  }
  
  console.log('\nTesting connection to Supabase...');
  
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await supabase.from('_schema_migrations').select('*').limit(1);
      
      if (error) {
        console.error(`❌ Connection failed with anon key: ${error.message}`);
        if (error.message.includes('Invalid API key')) {
          console.log('\n🔍 SOLUTION: Your NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be invalid.');
          console.log('  1. Go to your Supabase project settings');
          console.log('  2. Navigate to API section');
          console.log('  3. Copy the "anon public" key (NOT the service_role key)');
          console.log('  4. Update your .env.local file with the new key');
        }
      } else {
        console.log('✅ Successfully connected to Supabase with anon key');
      }
    } catch (e) {
      console.error(`❌ Error testing connection: ${e.message}`);
    }
  }
  
  console.log('\nChecking complete. If you see any errors, make sure to fix them in your .env.local file.');
}

checkEnv().catch(console.error); 