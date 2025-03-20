import { Resend } from 'resend'
import { env } from '@/lib/config/env'

// Initialize Resend with the API key from environment
export const resend = new Resend(env.RESEND_API_KEY);

// Helper function to send emails with better error handling
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  from?: string;
  bcc?: string | string[];
}) {
  try {
    // During testing, we need to set "to" as the verified email in Resend
    const testMode = process.env.NODE_ENV !== 'production';
    const toAddress = testMode ? 'werbatstalker@gmail.com' : options.to;
    
    // Use default from address if not provided
    const from = options.from || 'Color & Craft <onboarding@resend.dev>';
    
    console.log(`Sending email in ${testMode ? 'TEST' : 'PRODUCTION'} mode`);
    console.log(`From: ${from}`);
    console.log(`To: ${toAddress} (original: ${options.to})`);
    
    const { data, error } = await resend.emails.send({
      from,
      to: toAddress,
      subject: options.subject,
      text: options.text,
      html: options.html,
      bcc: options.bcc,
    });
    
    if (error) {
      console.error('Failed to send email:', error);
      throw new Error(error.message);
    }
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error in sendEmail:', error);
    return { success: false, error: error.message || 'Unknown error sending email' };
  }
} 