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
    // Use default from address if not provided
    const from = options.from || 'Color&Craft Real Estate <onboarding@resend.dev>';
    
    const { data, error } = await resend.emails.send({
      from,
      to: options.to,
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