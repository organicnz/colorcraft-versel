import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envInfo = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'exists' : 'missing',
      NEXT_PUBLIC_SUPABASE_URL_length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'exists' : 'missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY_length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing',
      SUPABASE_SERVICE_ROLE_KEY_length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    };

    console.log('Debug API called - checking environment variables:');
    console.log(envInfo);

    // Test Supabase connection
    console.log('Testing database connection...');
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase.from('_schema_migrations').select('*').limit(1);
      
      if (error) {
        console.log('Version query error:', error);
        return NextResponse.json({ 
          status: 'error', 
          message: 'Database connection failed', 
          error: error.message,
          hint: error.hint,
          envInfo 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        status: 'success', 
        message: 'Database connection successful', 
        envInfo 
      });
    } catch (error: any) {
      console.error('Supabase connection error:', error);
      return NextResponse.json({ 
        status: 'error', 
        message: 'Failed to connect to Supabase', 
        error: error.message,
        envInfo 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Environment check error:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: 'Environment check failed', 
      error: error.message 
    }, { status: 500 });
  }
} 