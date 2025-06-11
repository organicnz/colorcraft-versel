import { NextResponse } from "next/server";
import { getPortfolioProjects } from "@/services/portfolio.service";

export async function GET() {
  try {
    // Get all projects (not just featured)
    const allProjects = await getPortfolioProjects({});

    // Get just featured projects
    const featuredProjects = await getPortfolioProjects({ featuredOnly: true });

    return NextResponse.json({
      success: true,
      counts: {
        total: allProjects.length,
        featured: featuredProjects.length,
        non_featured: allProjects.length - featuredProjects.length,
      },
      breakdown: {
        all_projects: allProjects.map((p) => ({
          id: p.id,
          title: p.title,
          is_featured: p.is_featured,
          has_after_images: p.after_images && p.after_images.length > 0,
          after_images_count: p.after_images?.length || 0,
        })),
      },
    });
  } catch (error) {
    console.error("Portfolio count error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
