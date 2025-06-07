import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

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
      .from('projects')
      .select('*');
    
    // Apply featured filter if requested
    if (options?.featuredOnly) {
      query = query.eq('is_featured', true);
    }
    
    // Apply custom ordering if provided
    if (options?.orderBy && options.orderBy.length > 0) {
      options.orderBy.forEach(order => {
        query = query.order(order.column, { ascending: order.ascending });
      });
    } else {
      // Default ordering: featured first, then by created_at
      query = query
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
    }
    
    const { data: projects, error } = await query;
    
    if (error) {
      console.error('Supabase error fetching projects:', error);
      return []; // Return empty array instead of throwing
    }
    
    return projects || [];
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    return []; // Return empty array on any error
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
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // PGRST116 means no rows returned, which is expected when record is not found
        return null;
      }
      
      console.error('Supabase error fetching project:', error);
      throw new Error(`Failed to fetch portfolio project: ${error.message}`);
    }
    
    return project;
  } catch (error) {
    console.error(`Unexpected error in getPortfolioProject(${id}):`, error);
    return null; // Return null instead of throwing
  }
}

export async function getRelatedProjects(id: string, techniques: string[] = []) {
  try {
    const supabase = createClient();
    
    // If we have techniques, try to find projects with similar techniques
    if (techniques && techniques.length > 0) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .neq("id", id) // Exclude current project
        .filter('techniques', 'cs', `{${techniques[0]}}`) // Look for at least one matching technique
        .limit(3);
      
      if (!error && data && data.length >= 3) {
        return data;
      }
    }
    
    // Fallback: just get recent projects excluding current
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(3);
    
    if (error) {
      console.error("Supabase error fetching related projects:", error);
      return []; // Return empty array instead of throwing
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching related projects:", error);
    return []; // Return empty array on any error
  }
} 