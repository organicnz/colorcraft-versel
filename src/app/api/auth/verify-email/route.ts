import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/config/env';
import { sendEmail } from '@/lib/resend/client';

// Schema validation for the email verification request
const verifyEmailSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = verifyEmailSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { email } = result.data;
    
    // Create a Supabase server client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: any) => {
            cookieStore.set(name, value, options);
          },
          remove: (name: string, options: any) => {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          },
        },
      }
    );
    
    // Generate the verification link using Supabase
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    
    if (error) {
      console.error('Email verification error:', error.message);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }
    
    // Send the custom welcome email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
                      <img src="${env.NEXT_PUBLIC_SITE_URL}/images/logo-abstract-small.jpg" alt="Color & Craft Logo" style="height: 60px; border-radius: 4px;" />
        </div>
        
        <h2 style="color: #0F72C1; margin-bottom: 15px;">Welcome to Color & Craft!</h2>
        
        <p>Thank you for signing up with Color & Craft Furniture Painting. We're excited to have you join our community!</p>
        
        <p style="margin-top: 20px;">Please check your email inbox for a verification link from Supabase to complete your registration.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0;">Once your email is verified, you'll be able to:</p>
          <ul style="margin-top: 10px; padding-left: 20px;">
            <li>Browse our services</li>
            <li>Request quotes for furniture painting projects</li>
            <li>Track the status of your orders</li>
            <li>Receive special offers and updates</li>
          </ul>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
          Need help? Contact our support team at <a href="mailto:contact@colorcraft.live" style="color: #0F72C1;">contact@colorcraft.live</a>
        </p>
        
        <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
          <p style="font-size: 12px; color: #999;">
            Color & Craft Furniture Painting<br />
            © ${new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    `;
    
    // Send a branded welcome email in addition to Supabase's verification email
    await sendEmail({
      to: email,
      subject: "Welcome to Color & Craft - Verify Your Email",
      text: `Welcome to Color & Craft Furniture Painting! Thank you for signing up. Please check your email inbox for a verification link from Supabase to complete your registration.`,
      html: emailHtml,
    });
    
    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully"
    });
    
  } catch (error: any) {
    console.error('Email verification route error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 