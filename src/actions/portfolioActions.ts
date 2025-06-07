"use server"; // Mark this module as Server Actions

import { z } from "zod";
import { createClient } from "@/lib/supabase/server"; // Use server client for actions
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to parse comma-separated strings into arrays
function parseStringToArray(input: string | null | undefined): string[] {
  if (!input) return [];
  return input.split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

// Helper function to prepare form data
function prepareFormData(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  // Handle arrays that might come directly from FormData
  const beforeImages = formData.getAll('before_images[]').length > 0 
    ? formData.getAll('before_images[]') 
    : parseStringToArray(rawData.before_images as string);
    
  const afterImages = formData.getAll('after_images[]').length > 0 
    ? formData.getAll('after_images[]') 
    : parseStringToArray(rawData.after_images as string);
    
  const techniques = formData.getAll('techniques[]').length > 0 
    ? formData.getAll('techniques[]') 
    : parseStringToArray(rawData.techniques as string);
    
  const materials = formData.getAll('materials[]').length > 0 
    ? formData.getAll('materials[]') 
    : parseStringToArray(rawData.materials as string);

  // Format the date if present
  let completionDate = rawData.completion_date as string;
  if (completionDate && completionDate.trim() !== '') {
    // Ensure the date is in ISO format for validation
    try {
      const parsedDate = new Date(completionDate);
      if (!isNaN(parsedDate.getTime())) {
        completionDate = parsedDate.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error("Date parsing error:", e);
    }
  }

  return {
    ...rawData,
    id: rawData.id as string,
    before_images: beforeImages,
    after_images: afterImages,
    techniques: techniques,
    materials: materials,
    completion_date: completionDate || undefined,
    is_featured: rawData.is_featured === 'on' || rawData.is_featured === 'true' || String(rawData.is_featured) === 'true',
  };
}

// Re-use or define the schema here for validation within the action
// Note: File uploads need specific handling not included in this basic schema yet
const portfolioProjectSchema = z.object({
  id: z.string().uuid().optional(), // ID is needed for updates
  title: z.string().min(1, "Title is required"),
  brief_description: z.string().min(1, "Brief description is required"),
  description: z.string().optional(),
  before_images: z.array(z.string()).min(1, "At least one 'before' image URL is required"),
  after_images: z.array(z.string()).min(1, "At least one 'after' image URL is required"),
  techniques: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  completion_date: z.string().optional(),
  client_name: z.string().optional(),
  client_testimonial: z.string().optional(),
  is_featured: z.boolean().default(false).optional(),
});

// --- Create Portfolio Project Action ---
export async function createPortfolioProject(formData: FormData) {
  const supabase = createClient();

  // Basic validation: Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required. Please sign in." };
  
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: "Admin privileges required to create portfolio projects." };

  // Prepare data for validation
  const dataToValidate = prepareFormData(formData);

  // Validate the data
  const validatedFields = portfolioProjectSchema.omit({ id: true }).safeParse(dataToValidate);

  if (!validatedFields.success) {
    // Transform Zod errors into a more user-friendly format
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const formattedErrors = Object.entries(fieldErrors).reduce((acc, [key, messages]) => {
      acc[key] = messages.join(", ");
      return acc;
    }, {} as Record<string, string>);
    
    return {
      error: "Please fix the following errors:",
      fieldErrors: formattedErrors,
    };
  }

  // Prepare data for Supabase (handle nulls for optional arrays)
  const dataForSupabase = {
    ...validatedFields.data,
    techniques: validatedFields.data.techniques?.length ? validatedFields.data.techniques : null,
    materials: validatedFields.data.materials?.length ? validatedFields.data.materials : null,
  };

  try {
    const { error, data } = await supabase
      .from("portfolio")
      .insert(dataForSupabase)
      .select('id')
      .single();

    if (error) throw error;

    revalidatePath("/dashboard/portfolio"); // Revalidate the list page
    revalidatePath("/portfolio"); // Also revalidate the public portfolio page
    
    return { 
      success: true, 
      message: "Project created successfully!", 
      projectId: data?.id 
    };

  } catch (error: any) {
    console.error("DB Insert Error:", error);
    
    // Check for specific Supabase/Postgres errors
    if (error.code === '23505') {
      return { error: "A project with this title already exists." };
    }
    
    return { error: `Database Error: ${error.message}` };
  }
}

// --- Update Portfolio Project Action ---
export async function updatePortfolioProject(formData: FormData) {
  const supabase = createClient();

  // Basic validation: Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required. Please sign in." };
  
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: "Admin privileges required to update portfolio projects." };

  // Prepare data for validation
  const dataToValidate = prepareFormData(formData);
  
  // Validate the data
  const validatedFields = portfolioProjectSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    // Transform Zod errors into a more user-friendly format
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const formattedErrors = Object.entries(fieldErrors).reduce((acc, [key, messages]) => {
      acc[key] = messages.join(", ");
      return acc;
    }, {} as Record<string, string>);
    
    return {
      error: "Please fix the following errors:",
      fieldErrors: formattedErrors,
    };
  }

  const { id, ...updateData } = validatedFields.data; // Separate ID from the rest

  if (!id) {
    return { error: "Project ID is missing for update." };
  }

  // Prepare data for Supabase (handle nulls for optional arrays)
  const dataForSupabase = {
    ...updateData,
    techniques: updateData.techniques?.length ? updateData.techniques : null,
    materials: updateData.materials?.length ? updateData.materials : null,
  };

  try {
    const { error } = await supabase
      .from("portfolio")
      .update(dataForSupabase)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/dashboard/portfolio");
    revalidatePath(`/dashboard/portfolio/${id}/edit`);
    revalidatePath("/portfolio"); // Also revalidate the public portfolio page
    revalidatePath(`/portfolio/${id}`); // Revalidate the individual project page if it exists
    
    return { 
      success: true, 
      message: "Project updated successfully!",
      projectId: id
    };

  } catch (error: any) {
    console.error("DB Update Error:", error);
    
    // Check for specific Supabase/Postgres errors
    if (error.code === '23505') {
      return { error: "A project with this title already exists." };
    }
    
    return { error: `Database Error: ${error.message}` };
  }
}

// --- Delete Portfolio Project Action ---
export async function deletePortfolioProject(projectId: string) {
  const supabase = createClient();

  // Basic validation: Check if user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required. Please sign in." };
  
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: "Admin privileges required to delete portfolio projects." };

  if (!projectId) {
    return { error: "Project ID is required for deletion." };
  }

  try {
    // First check if the project exists
    const { data: project, error: fetchError } = await supabase
      .from("portfolio")
      .select("id, title")
      .eq("id", projectId)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return { error: "Project not found. It may have been already deleted." };
      }
      throw fetchError;
    }

    // Delete the project
    const { error } = await supabase
      .from("portfolio")
      .delete()
      .eq("id", projectId);

    if (error) throw error;

    revalidatePath("/dashboard/portfolio");
    revalidatePath("/portfolio"); // Also revalidate the public portfolio page
    
    return { 
      success: true, 
      message: `Project "${project.title}" deleted successfully.` 
    };

  } catch (error: any) {
    console.error("DB Delete Error:", error);
    return { error: `Database Error: ${error.message}` };
  }
}
