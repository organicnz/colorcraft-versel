import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function convertUrlToPath(url: string): string {
  if (!url || !url.includes("portfolio-images/")) {
    return url; // Return as-is if not a portfolio image URL
  }

  // Extract the path after portfolio-images/
  const match = url.match(/portfolio-images\/(.+)$/);
  return match ? match[1] : url;
}

export async function POST() {
  try {
    const supabase = await createClient();

    // Get all portfolio projects
    const { data: projects, error: fetchError } = await supabase
      .from("portfolio")
      .select("id, after_images, before_images");

    if (fetchError) {
      console.error("Error fetching projects:", fetchError);
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }

    let updatedCount = 0;
    const results = [];

    for (const project of projects || []) {
      let needsUpdate = false;
      const updates: { after_images?: string[]; before_images?: string[] } = {};

      // Convert after_images URLs to paths
      if (project.after_images && Array.isArray(project.after_images)) {
        const convertedAfterImages = project.after_images.map(convertUrlToPath);
        const hasFullUrls = project.after_images.some((img) => img && img.startsWith("http"));

        if (hasFullUrls) {
          updates.after_images = convertedAfterImages;
          needsUpdate = true;
        }
      }

      // Convert before_images URLs to paths
      if (project.before_images && Array.isArray(project.before_images)) {
        const convertedBeforeImages = project.before_images.map(convertUrlToPath);
        const hasFullUrls = project.before_images.some((img) => img && img.startsWith("http"));

        if (hasFullUrls) {
          updates.before_images = convertedBeforeImages;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from("portfolio")
          .update(updates)
          .eq("id", project.id);

        if (updateError) {
          console.error(`Error updating project ${project.id}:`, updateError);
          results.push({
            id: project.id,
            success: false,
            error: updateError.message,
          });
        } else {
          updatedCount++;
          results.push({
            id: project.id,
            success: true,
            originalAfterImages: project.after_images,
            convertedAfterImages: updates.after_images,
            originalBeforeImages: project.before_images,
            convertedBeforeImages: updates.before_images,
          });
        }
      } else {
        results.push({
          id: project.id,
          success: true,
          message: "No URLs to convert",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully converted URLs to paths for ${updatedCount} projects`,
      totalProjects: projects?.length || 0,
      updatedCount,
      results,
    });
  } catch (error: any) {
    console.error("Error in convert-urls-to-paths:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
