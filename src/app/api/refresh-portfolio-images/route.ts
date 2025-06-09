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
      // Refresh specific portfolio item using enhanced function
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

      // The enhanced function returns detailed information
      const refreshResult = data?.[0];
      result = {
        success: refreshResult?.success || false,
        message: refreshResult?.message || 'Unknown result',
        portfolioId,
        beforeCount: refreshResult?.before_count || 0,
        afterCount: refreshResult?.after_count || 0,
        beforeUrls: refreshResult?.before_urls || [],
        afterUrls: refreshResult?.after_urls || []
      };
    } else {
      // Refresh all portfolio items using enhanced function
      const { data, error } = await supabase.rpc('refresh_all_portfolio_images');

      if (error) {
        console.error('Error refreshing all portfolios:', error);
        return NextResponse.json(
          { error: `Failed to refresh portfolio images: ${error.message}` },
          { status: 500 }
        );
      }

      // Count successful and failed refreshes
      const successful = data?.filter((item: any) => item.status === 'success').length || 0;
      const failed = data?.filter((item: any) => item.status !== 'success').length || 0;
      const totalBefore = data?.reduce((sum: number, item: any) => sum + (item.before_count || 0), 0) || 0;
      const totalAfter = data?.reduce((sum: number, item: any) => sum + (item.after_count || 0), 0) || 0;

      result = {
        success: failed === 0,
        message: `Refreshed ${successful} portfolio items successfully${failed > 0 ? `, ${failed} failed` : ''}`,
        refreshedCount: successful,
        failedCount: failed,
        totalBeforeImages: totalBefore,
        totalAfterImages: totalAfter,
        details: data
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