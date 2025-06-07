import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Test basic connection with simple query
    const { data: healthData, error: healthError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5);

    if (healthError) {
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        details: healthError.message,
        hint: healthError.hint
      });
    }

    // Try to fetch from projects table
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('id, title')
      .limit(1);

    // Try to fetch from portfolio table
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id, title')
      .limit(1);

    return NextResponse.json({
      success: true,
      connection: 'OK',
      tables: healthData,
      projects: {
        error: projectsError?.message || null,
        data: projectsData,
        count: projectsData?.length || 0
      },
      portfolio: {
        error: portfolioError?.message || null,
        data: portfolioData,
        count: portfolioData?.length || 0
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Server error',
      message: error.message
    });
  }
} 