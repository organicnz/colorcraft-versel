import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/config/env';

// Force dynamic handling for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('Debug API called - checking environment variables:');
  console.log({
    NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL ? 'exists' : 'missing',
    NEXT_PUBLIC_SUPABASE_URL_length: env.NEXT_PUBLIC_SUPABASE_URL?.length,
    SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY ? 'exists' : 'missing',
    SUPABASE_SERVICE_ROLE_KEY_length: env.SUPABASE_SERVICE_ROLE_KEY?.length,
  });

  try {
    // Create an admin client specifically for server-side operations
    const supabase = createAdminClient();
    
    // First, test a simple query to verify connection
    console.log('Testing database connection...');
    
    try {
      const { data: versionData, error: versionError } = await supabase
        .from('_schema_migrations')
        .select('*')
        .limit(1);
        
      if (versionError) {
        console.error('Version query error:', versionError);
        return NextResponse.json({ 
          error: versionError.message,
          hint: versionError.hint,
          code: versionError.code,
          details: versionError.details
        }, { status: 500 });
      }
      
      console.log('Database connection successful');
    } catch (connError) {
      console.error('Connection test failed:', connError);
      return NextResponse.json({ 
        error: connError instanceof Error ? connError.message : 'Connection test failed',
      }, { status: 500 });
    }
    
    // Now try to fetch projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ 
        error: error.message,
        hint: error.hint,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      projects, 
      count: projects?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unexpected error in debug/projects API:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
} 