import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return NextResponse.json({ 
        error: 'Session error', 
        details: sessionError.message 
      }, { status: 401 });
    }
    
    if (!session) {
      return NextResponse.json({ 
        error: 'No session found',
        message: 'User not authenticated'
      }, { status: 401 });
    }
    
    // Get user role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, email, full_name')
      .eq('id', session.user.id)
      .single();
    
    if (userError) {
      return NextResponse.json({ 
        error: 'User lookup error', 
        details: userError.message 
      }, { status: 500 });
    }
    
    // Try to fetch portfolio data
    const { data: portfolioData, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id, title, status, is_featured, created_at')
      .order('created_at', { ascending: false });
    
    return NextResponse.json({
      success: true,
      session: {
        userId: session.user.id,
        email: session.user.email
      },
      user: userData,
      portfolio: {
        count: portfolioData?.length || 0,
        error: portfolioError?.message || null,
        sample: portfolioData?.slice(0, 3) || []
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Server error', 
      details: error.message 
    }, { status: 500 });
  }
} 