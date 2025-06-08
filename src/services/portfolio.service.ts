import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Helper function to parse PostgreSQL text[] arrays that come back as JSON strings
function parsePostgresArray(value: any): string[] {
  if (!value) return [];

  // If it's already an array, return it
  if (Array.isArray(value)) {
    return value;
  }

  // If it's a string that looks like a JSON array, parse it
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // If JSON parsing fails, treat as comma-separated string
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
  }

  return [];
}

// Helper function to normalize portfolio project data
function normalizePortfolioProject(project: any) {
  if (!project) return null;

  return {
    ...project,
    before_images: parsePostgresArray(project.before_images),
    after_images: parsePostgresArray(project.after_images),
    techniques: parsePostgresArray(project.techniques),
    materials: parsePostgresArray(project.materials),
  };
}

/**
 * Fetches all portfolio projects
 * @param options Optional parameters for fetching projects
 * @returns Array of portfolio projects
 */
export async function getPortfolioProjects(options?: {
  featuredOnly?: boolean;
  orderBy?: { column: string; ascending: boolean }[];
  useAdmin?: boolean; // Option to use admin client for higher privileges
}) {
  try {
    // Use admin client if specified, otherwise use regular server client
    const supabase = options?.useAdmin ? createAdminClient() : createClient();

    let query = supabase
      .from('portfolio')
      .select('*');

    // Apply featured filter if requested
    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }

    // Apply ordering if specified
    if (options?.orderBy && options.orderBy.length > 0) {
      for (const order of options.orderBy) {
        query = query.order(order.column, { ascending: order.ascending });
      }
    } else {
      // Default ordering: featured first, then by created_at desc
      query = query.order('is_featured', { ascending: false })
                   .order('created_at', { ascending: false });
    }

    const { data: projects, error } = await query;

    if (error) {
      console.error('Portfolio fetch error:', error);
      return [];
    }

    // Normalize the projects to ensure arrays are properly parsed
    const normalizedProjects = (projects || []).map(normalizePortfolioProject);
    return normalizedProjects;

  } catch (error: any) {
    console.error('Portfolio service error:', error);
    return [];
  }
}

/**
 * Fetches a single portfolio project by ID
 * @param id The project ID to fetch
 * @param useAdmin Whether to use admin client for higher privileges
 * @returns The portfolio project or null if not found
 */
export async function getPortfolioProject(id: string, useAdmin = false) {
  try {
    // Use admin client if specified, otherwise use regular server client
    const supabase = useAdmin ? createAdminClient() : createClient();

    const { data: project, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means no rows returned, which is expected when record is not found
        return null;
      }

      console.error('Portfolio project fetch error:', error);
      return null;
    }

    // Normalize the project to ensure arrays are properly parsed
    return normalizePortfolioProject(project);

  } catch (error: any) {
    console.error('Portfolio project service error:', error);
    return null;
  }
}

/**
 * Fetches related portfolio projects (excluding the current one)
 * @param currentProjectId ID of current project to exclude
 * @param limit Maximum number of related projects to return
 * @returns Array of related portfolio projects
 */
export async function getRelatedProjects(currentProjectId: string, limit = 3) {
  try {
    const supabase = createClient();

    const { data: projects, error } = await supabase
      .from('portfolio')
      .select('*')
      .neq('id', currentProjectId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Related projects fetch error:', error);
      return [];
    }

    // Normalize the projects to ensure arrays are properly parsed
    const normalizedProjects = (projects || []).map(normalizePortfolioProject);
    return normalizedProjects;

  } catch (error: any) {
    console.error('Related projects service error:', error);
    return [];
  }
} 