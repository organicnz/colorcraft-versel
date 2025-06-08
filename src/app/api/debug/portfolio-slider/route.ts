import { NextResponse } from 'next/server';
import { getPortfolioProjects } from '@/services/portfolio.service';

export async function GET() {
  try {
    console.log('🔍 Debug: Testing portfolio slider data fetch...');
    
    // Test the exact same call that the home page makes
    const featuredProjects = await getPortfolioProjects({
      featuredOnly: true,
      useAdmin: true, // Use admin client to bypass RLS for public portfolio display
      orderBy: [
        { column: 'completion_date', ascending: false }
      ]
    });

    console.log('📊 Debug: Featured projects result:', {
      count: featuredProjects.length,
      projects: featuredProjects.map(p => ({
        id: p.id,
        title: p.title,
        is_featured: p.is_featured,
        completion_date: p.completion_date
      }))
    });

    // Transform database projects to match the expected format for the UI (same as home page)
    const transformedProjects = featuredProjects.slice(0, 4).map((project) => ({
      id: project.id,
      title: project.title,
      description: project.brief_description || project.description,
      material: project.materials?.join(', ') || 'Custom finish',
      image: project.after_images?.[0] || "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      price: "Contact for pricing",
      raw_data: {
        brief_description: project.brief_description,
        description: project.description,
        materials: project.materials,
        after_images: project.after_images,
        is_featured: project.is_featured,
        completion_date: project.completion_date
      }
    }));

    // Test without admin as well
    const featuredProjectsNoAdmin = await getPortfolioProjects({
      featuredOnly: true,
      useAdmin: false, // Regular client
      orderBy: [
        { column: 'completion_date', ascending: false }
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Portfolio slider debug complete',
      results: {
        with_admin: {
          count: featuredProjects.length,
          projects: transformedProjects
        },
        without_admin: {
          count: featuredProjectsNoAdmin.length,
          projects: featuredProjectsNoAdmin.map(p => ({
            id: p.id,
            title: p.title,
            is_featured: p.is_featured
          }))
        },
        fallback_data: transformedProjects.length > 0 ? "Using database data" : "Would use fallback samples"
      }
    });

  } catch (error: any) {
    console.error('🚨 Debug: Portfolio slider error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 