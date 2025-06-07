import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/lib/config/env';
import { sendEmail } from '@/lib/resend/client';

// Schema validation for the password reset request
const resetPasswordSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { email } = result.data;
    
    // Create a Supabase server client
    const cookieStore = cookies();
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
    
    // Generate the reset password link using Supabase
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });
    
    if (error) {
      console.error('Password reset error:', error.message);
      return NextResponse.json(
        { error: "Failed to send password reset email" },
        { status: 500 }
      );
    }
    
    // Send the custom email with the reset link
    // The actual reset link is handled by Supabase, so we don't need to include it here
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${env.NEXT_PUBLIC_SITE_URL}/logo.png" alt="Color & Craft Logo" style="height: 60px;" />
        </div>
        
        <h2 style="color: #0F72C1; margin-bottom: 15px;">Reset Your Password</h2>
        
        <p>You requested to reset your password for your Color & Craft account. Please check your email inbox for a message from Supabase with the password reset link.</p>
        
        <p style="margin-top: 20px; margin-bottom: 30px;">If you didn't request a password reset, you can safely ignore this email.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p style="margin: 0; font-size: 14px; color: #666;">The password reset link will expire in 24 hours.</p>
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
    
    // Since Supabase handles the password reset email, this is just a supplemental branded email
    await sendEmail({
      to: email,
      subject: "Password Reset Instructions - Color & Craft",
      text: `You requested to reset your password for your Color & Craft account. Please check your email inbox for a message from Supabase with the password reset link. If you didn't request a password reset, you can safely ignore this email.`,
      html: emailHtml,
    });
    
    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully"
    });
    
  } catch (error: any) {
    console.error('Password reset route error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 