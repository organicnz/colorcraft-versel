import { NextResponse } from 'next/server';
import { env } from '@/lib/config/env';

export async function GET() {
  // IMPORTANT: This route is only meant for debugging during development
  // Remove this before deploying to production
  
  // SECURITY: Don't expose full keys, just check if they exist and partial details
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: {
      exists: Boolean(env.NEXT_PUBLIC_SUPABASE_URL),
      value: env.NEXT_PUBLIC_SUPABASE_URL ? `${env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 8)}...` : null,
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      exists: Boolean(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      length: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 0,
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      exists: Boolean(env.SUPABASE_SERVICE_ROLE_KEY),
      length: env.SUPABASE_SERVICE_ROLE_KEY ? env.SUPABASE_SERVICE_ROLE_KEY.length : 0,
    },
    RESEND_API_KEY: {
      exists: Boolean(env.RESEND_API_KEY),
      prefix: env.RESEND_API_KEY ? env.RESEND_API_KEY.substring(0, 3) : null,
    },
    NEXT_PUBLIC_EMAIL_FROM: {
      exists: Boolean(env.NEXT_PUBLIC_EMAIL_FROM),
      value: env.NEXT_PUBLIC_EMAIL_FROM,
    },
    NEXT_PUBLIC_SITE_URL: {
      exists: Boolean(env.NEXT_PUBLIC_SITE_URL),
      value: env.NEXT_PUBLIC_SITE_URL,
    },
  };

  return NextResponse.json({ 
    status: 'checking environment variables',
    env: envStatus,
  });
} 