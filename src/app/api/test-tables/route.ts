import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const results: any = {};
    
    // Test 1: Try projects table
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .limit(1);
      
      results.projects = {
        success: !projectsError,
        error: projectsError?.message || null,
        code: projectsError?.code || null,
        count: projectsData?.length || 0
      };
    } catch (e: any) {
      results.projects = { success: false, error: e.message };
    }
    
    // Test 2: Try portfolio table
    try {
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio')
        .select('*')
        .limit(1);
      
      results.portfolio = {
        success: !portfolioError,
        error: portfolioError?.message || null,
        code: portfolioError?.code || null,
        count: portfolioData?.length || 0
      };
    } catch (e: any) {
      results.portfolio = { success: false, error: e.message };
    }
    
    // Test 3: Try to create projects table (to see if it exists)
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('projects')
        .insert({ title: 'test' })
        .select();
      
      results.canInsert = {
        success: !insertError,
        error: insertError?.message || null,
        code: insertError?.code || null
      };
    } catch (e: any) {
      results.canInsert = { success: false, error: e.message };
    }
    
    return NextResponse.json({
      success: true,
      tests: results,
      info: {
        url: supabaseUrl.substring(0, 30) + '...',
        keyLength: supabaseKey.length
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