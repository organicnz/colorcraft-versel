import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if we have admin access
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all portfolio items
    const { data: portfolioItems, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id, title');

    if (portfolioError) {
      return NextResponse.json({ 
        error: 'Failed to fetch portfolio items', 
        details: portfolioError.message 
      }, { status: 500 });
    }

    if (!portfolioItems || portfolioItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No portfolio items found to create directories for',
        created: [],
        skipped: []
      });
    }

    // Check which directories already exist
    const { data: existingObjects, error: listError } = await supabase.storage
      .from('portfolio')
      .list('', { limit: 1000 });

    const existingDirectories = new Set(
      existingObjects?.map(obj => obj.name.split('/')[0]).filter(Boolean) || []
    );

    const results = {
      created: [] as Array<{ id: string; title: string }>,
      skipped: [] as Array<{ id: string; title: string; reason: string }>,
      errors: [] as Array<{ id: string; title: string; error: string }>
    };

    // Create directories for portfolio items that don't have them
    for (const item of portfolioItems) {
      const portfolioId = item.id;
      
      if (existingDirectories.has(portfolioId)) {
        results.skipped.push({
          id: portfolioId,
          title: item.title,
          reason: 'Directory already exists'
        });
        continue;
      }

      try {
        // Create a .gitkeep file to establish the directory
        const placeholder = new TextEncoder().encode('# Portfolio directory placeholder\nThis file ensures the directory exists in Supabase Storage.');
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(`${portfolioId}/.gitkeep`, placeholder, {
            contentType: 'text/plain',
            upsert: true
          });

        if (uploadError) {
          results.errors.push({
            id: portfolioId,
            title: item.title,
            error: uploadError.message
          });
        } else {
          results.created.push({
            id: portfolioId,
            title: item.title
          });
        }
      } catch (error: any) {
        results.errors.push({
          id: portfolioId,
          title: item.title,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Directory creation completed. Created: ${results.created.length}, Skipped: ${results.skipped.length}, Errors: ${results.errors.length}`,
      totalItems: portfolioItems.length,
      ...results
    });

  } catch (error: any) {
    console.error('Directory creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error during directory creation',
      message: error.message
    }, { status: 500 });
  }
} 