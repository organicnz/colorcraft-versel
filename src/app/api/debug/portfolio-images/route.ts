import { NextResponse } from 'next/server';
import { getPortfolioProjects } from '@/services/portfolio.service';

export async function GET() {
  try {
    const projects = await getPortfolioProjects({ limit: 3 });
    
    const imageData = projects.map(project => ({
      id: project.id,
      title: project.title,
      after_images: project.after_images,
      after_images_type: typeof project.after_images,
      after_images_is_array: Array.isArray(project.after_images),
      after_images_length: project.after_images?.length || 0,
      first_image: project.after_images?.[0] || null,
    }));

    return NextResponse.json({
      success: true,
      message: 'Portfolio image data retrieved successfully',
      data: imageData,
    });
  } catch (error) {
    console.error('Error fetching portfolio images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch portfolio images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 