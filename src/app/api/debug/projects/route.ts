import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    // Create client directly with the service role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
    
    return NextResponse.json({ projects, count: projects?.length || 0 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 