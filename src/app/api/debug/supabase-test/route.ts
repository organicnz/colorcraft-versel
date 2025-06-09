import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    const supabase = await createClient();
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
      message: 'Supabase connection successful',
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