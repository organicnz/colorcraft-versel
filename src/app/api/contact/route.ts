import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend/client'
import { z } from 'zod'

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
    
    // Validate the request data
    const result = contactFormSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: result.error.format() },
        { status: 400 }
      )
    }
    
    const { name, email, phone, message } = result.data
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'ColorCraft Furniture <contact@your-domain.com>',
      to: ['admin@your-domain.com'],
      subject: 'New Contact Form Submission',
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Message: ${message}
      `,
      html: `
<div>
  <h2>New Contact Form Submission</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
  <p><strong>Message:</strong></p>
  <p>${message}</p>
</div>
      `,
    })
    
    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }
    
    // Also save to Supabase if needed
    // const supabase = createClient()
    // const { error: dbError } = await supabase
    //   .from('inquiries')
    //   .insert({
    //     name,
    //     email,
    //     phone,
    //     message,
    //     status: 'new'
    //   })
    
    // if (dbError) {
    //   console.error('Error saving to database:', dbError)
    // }
    
    return NextResponse.json({ 
      success: true,
      message: "Contact form submitted successfully" 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 