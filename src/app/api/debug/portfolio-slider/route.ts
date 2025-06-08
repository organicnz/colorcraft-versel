import { NextResponse } from 'next/server';
import { getPortfolioProjects } from '@/services/portfolio.service';

export async function GET() {
  try {
    console.log('Debug: Fetching featured portfolio projects...');
    const projects = await getPortfolioProjects({ featuredOnly: true });

    console.log('Debug: Raw projects from database:', JSON.stringify(projects, null, 2));
    // Transform the data like the homepage does
    const transformedData = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.brief_description || project.description || "Beautiful furniture transformation",
      beforeImage: project.before_images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      afterImage: project.after_images?.[0] || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      materials: project.materials ? project.materials.join(', ') : 'Premium paint and finishes',
      rawProject: project
    }));
    return NextResponse.json({
      success: true,
      count: projects.length,
      rawProjects: projects,
      transformedData,
      debug: {
        message: 'This shows exactly what data the homepage slider is working with',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 