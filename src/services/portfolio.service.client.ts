import { createClient } from "@/lib/supabase/client";
import type { PortfolioProject } from "@/types/crm";

// Helper function to normalize portfolio project data
function normalizePortfolioProject(project: any): PortfolioProject {
  return {
    ...project,
    before_images: Array.isArray(project.before_images) ? project.before_images : [],
    after_images: Array.isArray(project.after_images) ? project.after_images : [],
    techniques: Array.isArray(project.techniques) ? project.techniques : [],
    materials: Array.isArray(project.materials) ? project.materials : [],
  };
}

export async function getPortfolioProjects(options?: {
  featuredOnly?: boolean;
  status?: "published" | "draft" | "archived";
  limit?: number;
  offset?: number;
  orderBy?: Array<{ column: string; ascending: boolean }>;
}) {
  const supabase = createClient();

  let query = supabase.from("portfolio").select("*");

  // Apply ordering
  if (options?.orderBy && options.orderBy.length > 0) {
    options.orderBy.forEach((order) => {
      query = query.order(order.column, { ascending: order.ascending });
    });
  } else {
    // Default ordering
    query = query.order("created_at", { ascending: false });
  }

  if (options?.featuredOnly) {
    query = query.eq("is_featured", true);
  }

  if (options?.status) {
    query = query.eq("status", options.status);
  } else {
    // By default, exclude archived projects
    query = query.neq("status", "archived");
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options?.limit || 10) - 1);
  }

  const { data: projects, error } = await query;

  if (error) {
    console.error("Error fetching portfolio projects:", error);
    throw new Error(`Failed to fetch portfolio projects: ${error.message}`);
  }

  if (!projects) {
    return [];
  }

  // Normalize the projects to ensure arrays are properly parsed
  return projects.map(normalizePortfolioProject);
}

export async function getPortfolioProject(id: string) {
  const supabase = createClient();

  const { data: project, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching portfolio project:", error);
    throw new Error(`Failed to fetch portfolio project: ${error.message}`);
  }

  if (!project) {
    return null;
  }

  return project as PortfolioProject;
}

export async function getPortfolioStats() {
  const supabase = createClient();

  const { data, error } = await supabase.from("portfolio").select("status");

  if (error) {
    throw new Error(`Failed to fetch portfolio stats: ${error.message}`);
  }

  const stats = {
    total: data?.length || 0,
    published: data?.filter((p: any) => p.status === "published").length || 0,
    draft: data?.filter((p: any) => p.status === "draft").length || 0,
    archived: data?.filter((p: any) => p.status === "archived").length || 0,
  };

  return stats;
}

export async function getFeaturedPortfolioProjects(limit = 3) {
  const supabase = createClient();

  const { data: projects, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured projects:", error);
    throw new Error("Failed to fetch featured projects");
  }

  return (projects || []) as PortfolioProject[];
}

export async function getRelatedProjects(currentProjectId: string, limit = 3) {
  try {
    const supabase = createClient();

    const { data: projects, error } = await supabase
      .from("portfolio")
      .select("*")
      .neq("id", currentProjectId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Related projects fetch error:", error);
      return [];
    }

    const normalizedProjects = (projects || []).map(normalizePortfolioProject);
    return normalizedProjects;
  } catch (error: any) {
    console.error("Related projects service error:", error);
    return [];
  }
}
