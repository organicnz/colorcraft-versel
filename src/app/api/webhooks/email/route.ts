import { NextResponse } from 'next/server'
import { verifySignature } from '@upstash/qstash/nextjs'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

async function handler(req: Request) {
  try {
    const body = await req.json()
    
    const { to, subject, html, type } = body

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      )
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'ColorCraft <hello@colorcraft.art>',
      to,
      subject,
      html,
    })

    if (error) {
      console.error('Email sending error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      )
    }

    console.log(`Email sent successfully (${type}):`, data?.id)
    
    return NextResponse.json({ 
      success: true, 
      messageId: data?.id,
      type 
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the handler directly
export { handler as POST } 