import { createClient } from "../lib/supabase/server";

export async function fetchAllProjects() {
  try {
    console.warn("🔍 Fetching all projects from Supabase...");

    const supabase = await createClient();
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error fetching projects:", error.message);
      throw error;
    }

    console.warn(`✅ Successfully fetched ${projects?.length || 0} projects`);

    // Log the first few projects for verification
    if (projects && projects.length > 0) {
      console.warn("📋 Sample projects:");
      projects.slice(0, 3).forEach((project, index) => {
        console.warn(`  ${index + 1}. ${project.title} (ID: ${project.id})`);
      });
    }

    return projects || [];
  } catch (error) {
    console.error("💥 Failed to fetch projects:", error);
    throw error;
  }
}

// If running this script directly
if (require.main === module) {
  fetchAllProjects()
    .then((projects) => {
      console.warn("\n📊 Total projects found:", projects.length);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}
