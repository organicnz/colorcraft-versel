#!/usr/bin/env node

/**
 * Test script for Resend email delivery scenarios
 * This script tests different email delivery scenarios using Resend's test email addresses
 * 
 * Usage: node scripts/test-resend-scenarios.js [scenario]
 * Scenarios: delivered, bounced, complained
 * Example: node scripts/test-resend-scenarios.js bounced
 * 
 * Documentation: https://resend.com/docs/dashboard/emails/send-test-emails
 */
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

// Get scenario from command line or default to 'delivered'
const scenario = process.argv[2] || 'delivered';

// Test email addresses from Resend documentation
const TEST_EMAILS = {
  delivered: 'delivered@resend.dev',
  bounced: 'bounced@resend.dev',
  complained: 'complained@resend.dev'
};

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// From address (use the one from env or a default)
const fromEmail = process.env.NEXT_PUBLIC_EMAIL_FROM || 'Color & Craft <contact@colorcraft.live>';

async function main() {
  // Validate scenario
  if (!TEST_EMAILS[scenario]) {
    console.error(`Invalid scenario: ${scenario}`);
    console.error('Valid scenarios: delivered, bounced, complained');
    process.exit(1);
  }

  const testEmail = TEST_EMAILS[scenario];

  console.log('Resend Test: Email Delivery Scenarios');
  console.log('------------------------------------');
  console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✓ Found' : '✗ Missing'}`);
  console.log(`FROM_EMAIL: ${fromEmail}`);
  console.log(`TESTING SCENARIO: ${scenario.toUpperCase()}`);
  console.log(`TO EMAIL: ${testEmail}`);
  console.log('\nSending test email...');

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: `Test Email - ${scenario.toUpperCase()} Scenario`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #0F72C1;">Resend Test: ${scenario.toUpperCase()} Scenario</h1>
          <p>This is a test email to verify the ${scenario} email scenario.</p>
          <p>Test recipient: <strong>${testEmail}</strong></p>
          <p>Timestamp: ${new Date().toISOString()}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 14px;">This email was sent as part of testing the Resend email delivery service.</p>
          <p style="color: #666; font-size: 14px;">Documentation: <a href="https://resend.com/docs/dashboard/emails/send-test-emails">Resend Test Emails</a></p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
    
    console.log('\nExpected behavior:');
    if (scenario === 'delivered') {
      console.log('- The email should be successfully delivered');
      console.log('- You should see a "delivered" event in webhooks (if configured)');
    } else if (scenario === 'bounced') {
      console.log('- The email should generate a bounce notification');
      console.log('- You should see a "bounced" event in webhooks (if configured)');
      console.log('- The email will not be delivered to the recipient');
    } else if (scenario === 'complained') {
      console.log('- The email should be marked as spam');
      console.log('- You should see a "complained" event in webhooks (if configured)');
    }
    
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.error('Make sure your RESEND_API_KEY is correct and your account is active.');
    process.exit(1);
  }
}

main(); 