#!/usr/bin/env node

/**
 * Test script for sending emails via Resend API
 * This will help verify that the password reset email functionality works.
 * 
 * Usage: node scripts/test-email.js [email]
 * Example: node scripts/test-email.js tamerlanium@gmail.com
 */
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

// Get email from command line or use default
const requestedEmail = process.argv[2] || 'tamerlanium@gmail.com';

// Resend's verified test email (required in test mode)
const verifiedTestEmail = 'werbatstalker@gmail.com';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

// From address (use the one from env or a default)
const fromEmail = process.env.NEXT_PUBLIC_EMAIL_FROM || 'onboarding@resend.dev';

async function main() {
  console.log('Test Email Sender');
  console.log('----------------');
  console.log(`RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✓ Found' : '✗ Missing'}`);
  console.log(`FROM_EMAIL: ${fromEmail}`);
  console.log(`REQUESTED EMAIL: ${requestedEmail}`);
  console.log(`ACTUAL RECIPIENT: ${verifiedTestEmail} (Resend test mode restriction)`);
  console.log('\nSending test email...');

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: verifiedTestEmail,
      subject: `Test Password Reset Email (for ${requestedEmail})`,
      html: `
        <h1>Password Reset Test</h1>
        <p>This is a test email to verify that the password reset functionality works correctly.</p>
        <p><strong>Note:</strong> This email was originally intended for: ${requestedEmail}</p>
        <p>It's being sent to you because Resend is in test mode, which only allows sending to verified email addresses.</p>
        <p>If you're receiving this, your email settings for ColorCraft are configured properly.</p>
        <p><a href="https://colorcraft.live/auth/reset-password?token=test-token" style="background-color: #0070f3; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Reset Password (Sample Link)</a></p>
        <p>If you didn't request this email, you can safely ignore it.</p>
      `,
    });

    if (error) {
      console.error('❌ Error sending email:', error);
      process.exit(1);
    }

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
    console.log('\nEmail was sent to:', verifiedTestEmail);
    console.log('NOTE: To send to other email addresses, you need to verify a domain in Resend');
    console.log('and update the FROM_EMAIL to use that domain.');
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    console.error('Make sure your RESEND_API_KEY is correct and your account is active.');
    process.exit(1);
  }
}

main(); 