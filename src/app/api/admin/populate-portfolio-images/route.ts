import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Mapping of project titles to their correct Supabase image URLs
const portfolioImageMappings = {
  'Art Deco Sideboard': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/sideboard.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/sideboard-before.png']
  },
  'Vintage Dresser': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/dresser.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/dresser-before.png']
  },
  'Modern Bookcase': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/bookcase.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/bookcase-before.png']
  },
  'Farmhouse Dining Table': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/farmhouse-dining-table.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/farmhouse-dining-table-before.png']
  },
  'Coastal Coffee Table': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/coffee-table.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/coffee-table-before.png']
  },
  'Antique Cabinet': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/cabinet.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/cabinet-before.png']
  },
  'Rustic Coffee Table': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/coffee-table.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/coffee-table-before.png']
  },
  'Mid-Century Console Revival': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/bookcase.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/bookcase-before.png']
  },
  'Vintage Dresser Restoration': {
    after_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/dresser.png'],
    before_images: ['https://tydgehnkaszuvcaywwdm.supabase.co/storage/v1/object/public/portfolio/dresser-before.png']
  }
};

export async function POST() {
  try {
    const supabase = createAdminClient();
    const results = [];

    console.log('🔧 Starting portfolio image population...');

    // Get all portfolio projects
    const { data: projects, error: fetchError } = await supabase
      .from('portfolio')
      .select('id, title, after_images, before_images');

    if (fetchError) {
      console.error('❌ Error fetching projects:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch projects', 
        details: fetchError.message 
      }, { status: 500 });
    }

    console.log(`📊 Found ${projects?.length || 0} projects to update`);

    // Update each project with correct images
    for (const project of projects || []) {
      const mapping = portfolioImageMappings[project.title as keyof typeof portfolioImageMappings];
      
      if (mapping) {
        const { error: updateError } = await supabase
          .from('portfolio')
          .update({
            after_images: mapping.after_images,
            before_images: mapping.before_images,
            updated_at: new Date().toISOString()
          })
          .eq('id', project.id);

        if (updateError) {
          console.error(`❌ Error updating ${project.title}:`, updateError);
          results.push({
            id: project.id,
            title: project.title,
            status: 'error',
            error: updateError.message
          });
        } else {
          console.log(`✅ Updated ${project.title} with images`);
          results.push({
            id: project.id,
            title: project.title,
            status: 'updated',
            after_images: mapping.after_images,
            before_images: mapping.before_images
          });
        }
      } else {
        console.log(`⚠️ No mapping found for ${project.title}`);
        results.push({
          id: project.id,
          title: project.title,
          status: 'skipped',
          reason: 'No image mapping found'
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio image population completed',
      updated_count: results.filter(r => r.status === 'updated').length,
      skipped_count: results.filter(r => r.status === 'skipped').length,
      error_count: results.filter(r => r.status === 'error').length,
      results
    });

  } catch (error: any) {
    console.error('💥 Unexpected error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Portfolio Image Population API',
    description: 'Use POST to populate portfolio images with correct Supabase URLs',
    available_mappings: Object.keys(portfolioImageMappings)
  });
} 