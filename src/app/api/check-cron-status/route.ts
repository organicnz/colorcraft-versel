import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check if pg_cron extension is enabled and get cron jobs
    const { data: cronJobs, error } = await supabase
      .rpc('get_cron_jobs')
      .select('*');

    if (error) {
      // If the function doesn't exist, try a direct query
      const { data: directQuery, error: directError } = await supabase
        .from('cron.job')
        .select('*')
        .eq('jobname', 'portfolio-sync-job');

      if (directError) {
        return NextResponse.json({
          success: false,
          error: 'Cannot access cron jobs',
          details: directError,
          message: 'Cron extension may not be enabled or accessible'
        });
      }

      return NextResponse.json({
        success: true,
        cronJobs: directQuery,
        source: 'direct_query'
      });
    }

    return NextResponse.json({
      success: true,
      cronJobs,
      source: 'rpc_function'
    });

  } catch (error) {
    console.error('Error checking cron status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 