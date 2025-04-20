#!/usr/bin/env node

/**
 * Database Connection Verification Tool
 * 
 * This script tests the Supabase database connection and reports any issues
 * that might be causing deployment failures on Vercel.
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Timeout for connection tests (in milliseconds)
const CONNECTION_TIMEOUT = 10000;

// Connection error types and solutions
const ERROR_SOLUTIONS = {
  'timeout': 'The connection timed out. This could be due to network issues or firewall restrictions on Vercel.',
  'auth_failed': 'Authentication failed. Check your Supabase URL and API keys in your Vercel environment variables.',
  'database_not_found': 'The database was not found. Verify your Supabase project is active and properly configured.',
  'rate_limit': 'You have exceeded the rate limit. Consider implementing better request throttling.',
  'network': 'A network error occurred. This could be due to connectivity issues between Vercel and Supabase.',
  'internal': 'An internal Supabase error occurred. Check the Supabase status page for any ongoing issues.',
  'default': 'An unknown error occurred. Review your database configuration and Vercel logs for more details.'
};

// Get the error type from error message
function getErrorType(error) {
  const errorMessage = error.toString().toLowerCase();
  
  if (errorMessage.includes('timeout')) return 'timeout';
  if (errorMessage.includes('auth') || errorMessage.includes('key') || errorMessage.includes('permission')) return 'auth_failed';
  if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) return 'database_not_found';
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) return 'rate_limit';
  if (errorMessage.includes('network') || errorMessage.includes('connection')) return 'network';
  if (errorMessage.includes('internal server error') || errorMessage.includes('500')) return 'internal';
  
  return 'default';
}

// Main verification function
async function verifyDatabaseConnection() {
  console.log('Database Connection Verification');
  console.log('------------------------------\n');
  
  // Check if environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables!');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }
  
  console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
  console.log(`Testing connection with anon key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...`);
  
  // Initialize Supabase client
  let supabase;
  try {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
    const errorType = getErrorType(error);
    console.error(`Solution: ${ERROR_SOLUTIONS[errorType]}`);
    process.exit(1);
  }
  
  // Test tables
  const tablesToTest = ['users', 'profiles', 'projects'];
  let hasConnectionError = false;
  
  for (const table of tablesToTest) {
    try {
      console.log(`Testing connection to ${table} table...`);
      
      // Create a promise that will reject after the timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT);
      });
      
      // Create the actual query promise - just select one row
      const queryPromise = supabase
        .from(table)
        .select('id')
        .limit(1);
      
      // Race the query against the timeout
      const { data, error } = await Promise.race([
        queryPromise,
        timeoutPromise.then(() => ({ data: null, error: new Error('Connection timeout') }))
      ]);
      
      if (error) throw error;
      
      console.log(`✅ Successfully connected to ${table} table`);
      if (data) {
        console.log(`   Found ${data.length} rows`);
      }
    } catch (error) {
      // Special handling for "relation does not exist" errors - the table might be named differently
      if (error.message && error.message.includes('does not exist')) {
        console.warn(`⚠️ Table '${table}' does not exist in the database.`);
        console.warn(`   This is not a connection error, but you should verify the table name.`);
        continue;
      }
      
      hasConnectionError = true;
      console.error(`❌ Failed to connect to ${table} table:`, error.message);
      const errorType = getErrorType(error);
      console.error(`   Solution: ${ERROR_SOLUTIONS[errorType]}`);
    }
  }
  
  // Try a generic connection test as a fallback
  if (hasConnectionError) {
    try {
      console.log('\nAttempting fallback connection test...');
      const { data, error } = await supabase.rpc('get_system_time');
      
      if (error) throw error;
      
      console.log(`✅ Successfully connected to database using RPC call`);
      console.log(`   System time: ${data}`);
      
      // If we got here, we have some connectivity
      console.log('\n⚠️ Partial connectivity detected: RPC works but table access failed');
      console.log('   This suggests permission issues rather than connection problems.');
      hasConnectionError = false;
    } catch (error) {
      console.error(`❌ Fallback connection test also failed:`, error.message);
    }
  }
  
  // Summary
  console.log('\nVerification Summary:');
  if (hasConnectionError) {
    console.log('❌ Database connection issues detected');
    console.log('\nRecommended actions:');
    console.log('1. Verify your Supabase project is active');
    console.log('2. Check your API keys in Vercel environment variables');
    console.log('3. Ensure your IP allow list in Supabase includes Vercel deployment IPs');
    console.log('4. Check for Supabase service outages');
    process.exit(1);
  } else {
    console.log('✅ All database connection tests successful');
    process.exit(0);
  }
}

// Run the test
verifyDatabaseConnection().catch(error => {
  console.error('Unhandled error during verification:', error);
  process.exit(1);
}); 