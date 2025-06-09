import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('Testing Supabase connection with direct API key...');
    
    const cookieStore = await cookies();
    
    // Use the exact API key from CLI
    const supabaseUrl = 'https://tydgehnkaszuvcaywwdm.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZGdlaG5rYXN6dXZjYXl3d2RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NDg0OTcsImV4cCI6MjA1ODAyNDQ5N30.YpQdD8zSpel_JmAVS3oL_esnNRSUY5mNVhPomZWCYQI';

    console.log('Using direct API key:', {
      url: supabaseUrl,
      keyLength: supabaseAnonKey.length,
      keyStart: supabaseAnonKey.substring(0, 20)
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            console.warn("Failed to set cookie:", name, error);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch (error) {
            console.warn("Failed to remove cookie:", name, error);
          }
        },
      },
    });

    console.log('Supabase client created successfully');

    // Test a simple query to see if the connection works
    const { data, error, count } = await supabase
      .from('portfolio')
      .select('id, title, status', { count: 'exact' })
      .limit(1);

    console.log('Query result:', { data, error, count });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { 
          error: 'Supabase query failed', 
          details: error.message,
          code: error.code,
          hint: error.hint 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful with direct API key',
      data: {
        totalCount: count,
        sampleData: data,
        connectionStatus: 'OK'
      },
    });
  } catch (error: any) {
    console.error('Supabase connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Supabase', details: error.message },
      { status: 500 }
    );
  }
} 