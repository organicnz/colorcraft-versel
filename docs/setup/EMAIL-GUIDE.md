# Email System Guide for Color & Craft

This guide explains the email system used in the Color & Craft application, covering setup, customization, and testing.

## Overview

The application uses a combination of [Resend](https://resend.com) for email delivery and [Supabase Auth](https://supabase.com/auth) for authentication flows. We've implemented custom branded email templates for various user interactions.

## Email Types

The application sends the following types of emails:

1. **Contact Form Confirmation** - Sent when a user submits the contact form
2. **Password Reset** - Sent when a user requests a password reset
3. **Email Verification** - Sent during signup or when a user requests verification
4. **Welcome Email** - Sent alongside email verification to provide additional information

## Implementation Details

### Email Service Setup

The email service is set up in `src/lib/resend/client.ts`. This file initializes the Resend client with an API key and provides a `sendEmail` helper function that abstracts the email sending process with error handling.

#### Key Features

- **Environment Detection**: Different behavior in test vs. production environments
- **Error Handling**: Comprehensive error handling for failed email deliveries
- **Default Sender**: Uses the configured default sender email from environment variables

### Email Templates

Email templates are defined inline in each API route or component that sends emails:

1. **Contact Form** - `src/app/api/contact/route.ts`
2. **Password Reset** - `src/app/api/auth/reset-password/route.ts`
3. **Email Verification** - `src/app/api/auth/verify-email/route.ts`

All templates use responsive HTML with inline CSS and are designed to look good on various devices and email clients.

### Authentication Integration

For authentication-related emails, we use a combination of:

1. **Supabase Auth** - Handles the core functionality (generating secure tokens, etc.)
2. **Custom Email Templates** - Sends additional branded emails with more information

This approach ensures security while providing a customized user experience.

## Testing

### Test Scripts

The following scripts are available to test the email functionality:

```bash
# Test basic email sending
npm run test:email [recipient@example.com]

# Test password reset email
npm run test:email:reset [recipient@example.com]

# Test verification email
npm run test:email:verify [recipient@example.com]
```

### Test Mode

In development and test environments:

1. Emails are always sent to the verified test email address (`werbatstalker@gmail.com`)
2. The original recipient is mentioned in the email content
3. Console logs provide information about the email delivery

This is due to Resend's restriction that non-production emails can only be sent to verified addresses.

## Customization

To customize email templates:

1. Edit the HTML template in the relevant API route or component
2. Ensure all CSS is inline (email clients often strip out external CSS)
3. Test the email by using the test scripts

## Environment Variables

The email functionality requires the following environment variables:

```
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_EMAIL_FROM=Your Name <your@domain.com>
```

In production, make sure to verify your domain in Resend to be able to send emails from your custom domain.

## Troubleshooting

Common issues and solutions:

1. **Emails not sending**: Check the Resend API key and verify that it's active
2. **Emails going to spam**: Verify your domain in Resend and ensure DKIM/SPF records are set up
3. **Custom templates not working**: Make sure HTML is valid and CSS is inline

For more detailed logs, check the Resend dashboard or application logs.

## Security Considerations

- Never expose the Resend API key in client-side code
- Implement rate limiting for API routes that send emails
- Validate email addresses before sending
- Implement measures to prevent email harvesting or spam

## Support

For issues with the email system, contact the development team or refer to:

- [Resend Documentation](https://resend.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) 