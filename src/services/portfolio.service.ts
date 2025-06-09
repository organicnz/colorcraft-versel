import { createClient } from '@/lib/supabase/server';
import type { PortfolioProject } from '@/types/crm';

export async function getPortfolioProjects(options?: {
  featuredOnly?: boolean;
  status?: 'published' | 'draft' | 'archived';
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();

  let query = supabase
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: false });

  if (options?.featuredOnly) {
    query = query.eq('is_featured', true);
  }

  if (options?.status) {
    query = query.eq('status', options.status);
  } else {
    // By default, exclude archived projects
    query = query.neq('status', 'archived');
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data: projects, error } = await query;

  if (error) {
    console.error('Error fetching portfolio projects:', error);
    throw new Error('Failed to fetch portfolio projects');
  }

  // No normalization needed - JSONB arrays come back as native JavaScript arrays
  return (projects || []) as PortfolioProject[];
}

export async function getPortfolioProject(id: string, useAdmin = false) {
  const supabase = await createClient();

  let query = supabase
    .from('portfolio')
    .select('*')
    .eq('id', id);

  if (!useAdmin) {
    query = query.eq('status', 'published');
  }

  const { data: project, error } = await query.single();

  if (error) {
    console.error('Error fetching portfolio project:', error);
    return null;
  }

  // No normalization needed - JSONB arrays come back as native JavaScript arrays
  return project as PortfolioProject;
}

export async function getFeaturedPortfolioProjects(limit = 3) {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured projects:', error);
    throw new Error('Failed to fetch featured projects');
  }

  // No normalization needed - JSONB arrays come back as native JavaScript arrays
  return (projects || []) as PortfolioProject[];
}

/**
 * Fetches related portfolio projects (excluding the current one)
 * @param currentProjectId ID of current project to exclude
 * @param limit Maximum number of related projects to return
 * @returns Array of related portfolio projects
 */
export async function getRelatedProjects(currentProjectId: string, limit = 3) {
  try {
    const supabase = await createClient();

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