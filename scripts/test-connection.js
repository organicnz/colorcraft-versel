#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  console.log('Testing connection to Supabase database...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('ERROR: Missing Supabase connection variables');
    console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'exists' : 'missing'}`);
    console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'exists' : 'missing'}`);
    process.exit(1);
  }
  
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Anon Key: ${supabaseAnonKey.substring(0, 5)}...${supabaseAnonKey.substring(supabaseAnonKey.length - 5)}`);
  
  try {
    console.log('Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection with projects table
    console.log('Testing connection to projects table...');
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('count')
      .limit(1);
      
    if (projectsError) {
      console.error('ERROR connecting to projects table:', projectsError.message);
      console.error('Error details:', {
        code: projectsError.code,
        hint: projectsError.hint,
        details: projectsError.details
      });
    } else {
      console.log('Successfully connected to projects table.');
      console.log('Projects found:', projectsData);
    }
    
    // Test connection with services table
    console.log('\nTesting connection to services table...');
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('count')
      .limit(1);
      
    if (servicesError) {
      console.error('ERROR connecting to services table:', servicesError.message);
      console.error('Error details:', {
        code: servicesError.code,
        hint: servicesError.hint,
        details: servicesError.details
      });
    } else {
      console.log('Successfully connected to services table.');
      console.log('Services found:', servicesData);
    }
    
    // Test connection with users table
    console.log('\nTesting connection to users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
      
    if (usersError) {
      console.error('ERROR connecting to users table:', usersError.message);
      console.error('Error details:', {
        code: usersError.code,
        hint: usersError.hint,
        details: usersError.details
      });
    } else {
      console.log('Successfully connected to users table.');
      console.log('Users found:', usersData);
    }
    
  } catch (error) {
    console.error('FATAL ERROR:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

testConnection().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 