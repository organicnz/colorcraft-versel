#!/usr/bin/env node

/**
 * Test script for sending custom emails via our API routes
 * 
 * Usage: node scripts/test-custom-emails.js [reset|verify] [email]
 * Example: node scripts/test-custom-emails.js reset test@example.com
 * Example: node scripts/test-custom-emails.js verify test@example.com
 */
require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

// Get email type and address from command line
const emailType = process.argv[2]?.toLowerCase() || 'reset';
const email = process.argv[3] || 'test@example.com';

// Validate email type
if (!['reset', 'verify'].includes(emailType)) {
  console.error('Error: Email type must be either "reset" or "verify"');
  process.exit(1);
}

// Use localhost for testing, override the environment variable
const siteUrl = 'http://localhost:3000';

async function main() {
  console.log('Custom Email Test Sender');
  console.log('----------------------');
  console.log(`EMAIL TYPE: ${emailType}`);
  console.log(`EMAIL ADDRESS: ${email}`);
  console.log(`SITE URL: ${siteUrl}`);
  console.log('\nSending test email...');

  try {
    // Determine which API endpoint to use
    const endpoint = emailType === 'reset' 
      ? `${siteUrl}/api/auth/reset-password` 
      : `${siteUrl}/api/auth/verify-email`;
    
    // Make the API request
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ Error sending email:', data.error || 'Unknown error');
      process.exit(1);
    }
    
    console.log('✅ Email request sent successfully!');
    console.log('Response:', data);
    console.log('\nNote: In test mode, emails are sent to the verified test email,');
    console.log('not to the requested recipient. Check the Resend dashboard for details.');
  } catch (error) {
    console.error('❌ Failed to send email request:', error.message);
    console.error('Make sure your local server is running and API routes are accessible.');
    process.exit(1);
  }
}

main(); 