import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { portfolioId } = body;

    let result;

    if (portfolioId) {
      // Refresh specific portfolio item
      const { data, error } = await supabase.rpc('refresh_portfolio_images', {
        portfolio_uuid: portfolioId
      });

      if (error) {
        console.error('Error refreshing specific portfolio:', error);
        return NextResponse.json(
          { error: `Failed to refresh portfolio ${portfolioId}: ${error.message}` },
          { status: 500 }
        );
      }

      result = {
        success: data,
        message: data 
          ? `Successfully refreshed images for portfolio ${portfolioId}`
          : `Portfolio ${portfolioId} not found`,
        portfolioId
      };
    } else {
      // Refresh all portfolio items
      const { data, error } = await supabase.rpc('refresh_all_portfolio_images');

      if (error) {
        console.error('Error refreshing all portfolios:', error);
        return NextResponse.json(
          { error: `Failed to refresh portfolio images: ${error.message}` },
          { status: 500 }
        );
      }

      result = {
        success: true,
        message: `Successfully refreshed images for ${data} portfolio items`,
        refreshedCount: data
      };
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Unexpected error in refresh-portfolio-images:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Portfolio Image Refresh API',
    endpoints: {
      'POST /': 'Refresh portfolio images',
      'POST / with portfolioId': 'Refresh specific portfolio images'
    },
    usage: {
      'Refresh all': 'POST {} - Refreshes all portfolio items',
      'Refresh specific': 'POST {"portfolioId": "uuid"} - Refreshes specific portfolio'
    }
  });
} 