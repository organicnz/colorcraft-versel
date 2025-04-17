import { createClient } from '@/lib/supabase/server';

/**
 * Fetches all portfolio projects
 * @param options Optional parameters for fetching projects
 * @returns Array of portfolio projects
 */
export async function getPortfolioProjects(options?: {
  featuredOnly?: boolean;
  orderBy?: { column: string; ascending: boolean }[];
}) {
  try {
    const supabase = createClient();
    
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
      console.error('Error fetching portfolio projects:', error);
      throw new Error(`Failed to fetch portfolio projects: ${error.message}`);
    }
    
    return projects || [];
  } catch (error) {
    console.error('Unexpected error in getPortfolioProjects:', error);
    throw error;
  }
}

/**
 * Fetches a single portfolio project by ID
 * @param id The project ID to fetch
 * @returns The portfolio project or null if not found
 */
export async function getPortfolioProject(id: string) {
  try {
    const supabase = createClient();
    
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
      
      console.error('Error fetching portfolio project:', error);
      throw new Error(`Failed to fetch portfolio project: ${error.message}`);
    }
    
    return project;
  } catch (error) {
    console.error(`Unexpected error in getPortfolioProject(${id}):`, error);
    throw error;
  }
} 