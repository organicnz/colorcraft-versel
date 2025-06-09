import { NextResponse } from 'next/server';
import { env } from '@/lib/config/env';

export async function GET() {
  try {
    // Get environment variables (safely)
    const envInfo = {
      NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_LENGTH: env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_FIRST_10: env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) || 'missing',
      SUPABASE_SERVICE_ROLE_KEY_LENGTH: env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      SUPABASE_SERVICE_ROLE_KEY_FIRST_10: env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) || 'missing',
      NODE_ENV: process.env.NODE_ENV,
      // Raw environment variables for comparison
      RAW_ANON_KEY_LENGTH: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      RAW_ANON_KEY_FIRST_10: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 10) || 'missing',
    };

    return NextResponse.json({
      success: true,
      message: 'Environment variables debug info',
      data: envInfo,
    });
  } catch (error: any) {
    console.error('Environment debug error:', error);
    return NextResponse.json(
      { error: 'Failed to get environment info', details: error.message },
      { status: 500 }
    );
  }
} 