import { NextResponse } from 'next/server'
import { z } from 'zod'
import { env } from '@/lib/config/env'
import { sendEmail } from '@/lib/resend/client'

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    console.log('Received contact form submission:', { ...body, message: body.message?.substring(0, 20) + '...' })
    
    // Validate the request data
    const result = contactFormSchema.safeParse(body)
    if (!result.success) {
      console.error('Validation failed:', result.error.format())
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.format() },
        { status: 400 }
      )
    }
    
    const { name, email, phone, message } = result.data
    console.log('Attempting to send email...')
    
    // Prepare email content
    const emailText = `
Thank you for contacting Color & Craft Furniture Painting!

We've received your message and will get back to you shortly.

Your submitted information:
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Message: ${message}

Best regards,
The Color & Craft Team
    `;

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
  <h2 style="color: #0F72C1;">Thank you for contacting Color & Craft Furniture Painting!</h2>
  <p>We've received your message and will get back to you shortly.</p>
  
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
    <h3 style="margin-top: 0;">Your submitted information:</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  </div>
  
  <p style="margin-top: 20px;">Best regards,<br>The Color & Craft Team</p>
</div>
    `;
    
    // For development testing, we'll show a note about where the email would go
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    
    // Send the email
    const emailResult = await sendEmail({
      to: email,
      subject: 'Your message to Color & Craft Furniture Painting',
      text: emailText,
      html: emailHtml,
      bcc: 'tamerlanium@gmail.com',
    });
    
    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      
      // Special handling for Resend's email restriction error
      if (emailResult.error && emailResult.error.includes('can only send testing emails to your own email address')) {
        return NextResponse.json(
          { 
            warning: true,
            message: "Have questions or want to discuss your project? We'd love to hear from you! Your message was received! In demo mode, emails are only simulated. In production, you would receive a confirmation email.",
            details: "Development environment - emails are not actually sent to users during testing."
          },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to send email: ${emailResult.error}` },
        { status: 500 }
      );
    }
    
    console.log('Email sent successfully:', emailResult.data);
    
    return NextResponse.json({ 
      success: true,
      message: "Contact form submitted successfully" 
    });
    
  } catch (error: any) {
    console.error('Contact form error:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: `Internal server error: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
} 