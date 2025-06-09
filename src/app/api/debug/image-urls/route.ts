import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get one portfolio project for testing
    const { data: project } = await supabase
      .from('portfolio')
      .select('id, title, after_images')
      .eq('status', 'published')
      .limit(1)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'No projects found' });
    }

    // Test URL generation
    const storage = supabase.storage.from('portfolio-images');
    
    let testUrls: string[] = [];
    if (project.after_images && Array.isArray(project.after_images)) {
      testUrls = project.after_images.map(path => {
        const { data } = storage.getPublicUrl(path);
        return data.publicUrl;
      });
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        raw_after_images: project.after_images,
        after_images_type: typeof project.after_images,
        after_images_is_array: Array.isArray(project.after_images),
        generated_urls: testUrls,
      },
    });
  } catch (error) {
    console.error('Error testing image URLs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 