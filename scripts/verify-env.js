#!/usr/bin/env node

/**
 * This script verifies that all required environment variables are set
 * and outputs instructions for fixing any issues.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Fallback chalk functions if chalk is not available
const chalk = (() => {
  try {
    return require('chalk');
  } catch (e) {
    return { green: s => s, red: s => s, yellow: s => s, blue: s => s, bold: s => s };
  }
})();

// Define required environment variables
const REQUIRED_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

// Optional variables - will show warnings but not errors
const OPTIONAL_VARS = [
  'RESEND_API_KEY',
  'NEXT_PUBLIC_EMAIL_FROM'
];

// Get current environment
function getEnvironmentName() {
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV; // 'production', 'preview', or 'development'
  }
  return process.env.NODE_ENV || 'development';
}

// Main verification function
function verifyEnvironment() {
  console.log(chalk.bold('Environment Variables Verification'));
  console.log(`Environment: ${chalk.blue(getEnvironmentName())}`);
  console.log('------------------------\n');
  
  let hasErrors = false;
  const missingRequired = [];
  const missingOptional = [];
  
  // Verify required variables
  console.log(chalk.bold('Required Variables:'));
  for (const varName of REQUIRED_VARS) {
    const value = process.env[varName];
    if (!value) {
      console.log(`${chalk.red('✘')} ${varName}: Missing`);
      missingRequired.push(varName);
      hasErrors = true;
    } else {
      // Show a preview of the value (first 5 chars + last 5 chars)
      let preview = value;
      if (value.length > 15) {
        preview = `${value.substring(0, 5)}...${value.substring(value.length - 5)}`;
      }
      console.log(`${chalk.green('✓')} ${varName}: ${chalk.blue(preview)} (${value.length} chars)`);
    }
  }
  
  // Verify optional variables
  console.log('\n' + chalk.bold('Optional Variables:'));
  for (const varName of OPTIONAL_VARS) {
    const value = process.env[varName];
    if (!value) {
      console.log(`${chalk.yellow('!')} ${varName}: Missing (optional)`);
      missingOptional.push(varName);
    } else {
      console.log(`${chalk.green('✓')} ${varName}: Set`);
    }
  }
  
  // Report and provide instructions
  console.log('\n' + chalk.bold('Verification Summary:'));
  
  if (hasErrors) {
    console.log(chalk.red(`✘ Found ${missingRequired.length} missing required variables`));
    console.log('\nTo fix this issue:');
    console.log('1. Add the following to your .env.local file or Vercel environment variables:');
    for (const varName of missingRequired) {
      console.log(`   ${varName}=your-${varName.toLowerCase().replace(/_/g, '-')}-value`);
    }
    
    console.log('\n2. For Vercel deployment:');
    console.log('   - Go to your Vercel project dashboard');
    console.log('   - Navigate to Settings > Environment Variables');
    console.log('   - Add each missing variable');
    console.log('   - Deploy again or click "Redeploy" on your latest deployment');
    
    console.log('\nImportant Notes:');
    console.log('- The NEXT_PUBLIC_SUPABASE_ANON_KEY should be the "anon public" key from your Supabase project settings');
    console.log('- Do NOT use the service_role key for NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('- Make sure to enable the variables for all environments (Production, Preview, Development)');
    
    // In Vercel environment, just warn but don't fail the build
    if (process.env.VERCEL === "1") {
      console.log(chalk.yellow('\n⚠️  Running in Vercel - environment variables should be configured in Vercel dashboard'));
      console.log(chalk.yellow('   Build will continue but app may not work properly without these variables'));
      process.exit(0);
    } else {
      process.exit(1);
    }
  } else {
    console.log(chalk.green('✓ All required environment variables are set'));
    
    if (missingOptional.length > 0) {
      console.log(chalk.yellow(`! Found ${missingOptional.length} missing optional variables`));
      console.log('  These are not required but may limit functionality:');
      for (const varName of missingOptional) {
        console.log(`   - ${varName}`);
      }
    }
    
    console.log('\nYour environment is correctly configured for Supabase integration.');
    process.exit(0);
  }
}

// Run the verification
try {
  verifyEnvironment();
} catch (error) {
  console.error('Error during verification:', error);
  process.exit(1);
} 