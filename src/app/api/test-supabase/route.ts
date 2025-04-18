import { NextResponse } from 'next/server';
import { createClient as createClientBase } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing Supabase credentials',
        env: {
          url: Boolean(supabaseUrl),
          key: Boolean(supabaseKey),
          url_length: supabaseUrl?.length || 0,
          key_length: supabaseKey?.length || 0
        }
      }, { status: 500 });
    }
    
    // Create a direct client without cookies
    const supabase = createClientBase(supabaseUrl, supabaseKey);
    
    // Try a simple query
    const { data, error } = await supabase.from('services').select('count').limit(1);
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database query failed',
        error: error.message,
        hint: error.hint,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to Supabase',
      data
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 