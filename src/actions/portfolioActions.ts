"use server"; // Mark this module as Server Actions

import { z } from "zod";
import { createClient } from "@/lib/supabase/server"; // Use server client for actions
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  completion_date: z.date().optional(),
  client_name: z.string().optional(),
  client_testimonial: z.string().optional(),
  is_featured: z.boolean().default(false).optional(),
});

// --- Create Portfolio Project Action ---
export async function createPortfolioProject(formData: FormData) {
  const supabase = createClient();

  // Basic validation: Check if user is admin (adapt based on your user/role fetching)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Authentication required." };
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return { error: "Admin privileges required." };


  // Convert FormData to a plain object
  // Note: This basic conversion might need adjustment for dates/arrays/booleans depending on how they are sent
  const rawData = Object.fromEntries(formData.entries());

  // Prepare data for validation (manual type conversion might be needed)
  const dataToValidate = {
      ...rawData,
      before_images: formData.getAll('before_images[]'), // Assuming array inputs end with []
      after_images: formData.getAll('after_images[]'),
      techniques: formData.getAll('techniques[]'),
      materials: formData.getAll('materials[]'),
      is_featured: rawData.is_featured === 'on' || rawData.is_featured === 'true',
      // completion_date: rawData.completion_date ? new Date(rawData.completion_date as string) : undefined, // Needs robust date parsing
  };

   console.log("Raw Data for Create:", rawData);
   console.log("Data to Validate:", dataToValidate);


  const validatedFields = portfolioProjectSchema.omit({ id: true }).safeParse(dataToValidate);

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      error: "Validation failed.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Prepare data for Supabase (handle nulls for optional arrays)
  const dataForSupabase = {
       ...validatedFields.data,
       techniques: validatedFields.data.techniques?.length ? validatedFields.data.techniques : null,
       materials: validatedFields.data.materials?.length ? validatedFields.data.materials : null,
       // TODO: Handle date formatting if necessary for DB
  };

  try {
    const { error } = await supabase
      .from("projects")
      .insert(dataForSupabase);

    if (error) throw error;

    revalidatePath("/dashboard/portfolio"); // Revalidate the list page
    // redirect("/dashboard/portfolio"); // Optionally redirect
    return { success: true, message: "Project created successfully!" };

  } catch (error: any) {
    console.error("DB Insert Error:", error);
    return { error: `Database Error: ${error.message}` };
  }
}

// --- Update Portfolio Project Action ---
export async function updatePortfolioProject(formData: FormData) {
   const supabase = createClient();

   // Basic validation: Check if user is admin
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return { error: "Authentication required." };
   const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
   if (profile?.role !== 'admin') return { error: "Admin privileges required." };


   const rawData = Object.fromEntries(formData.entries());

   // Prepare data for validation
   const dataToValidate = {
       ...rawData,
       id: rawData.id as string, // Ensure ID is present and typed
       before_images: formData.getAll('before_images[]'),
       after_images: formData.getAll('after_images[]'),
       techniques: formData.getAll('techniques[]'),
       materials: formData.getAll('materials[]'),
       is_featured: rawData.is_featured === 'on' || rawData.is_featured === 'true',
       // completion_date: rawData.completion_date ? new Date(rawData.completion_date as string) : undefined,
   };

   console.log("Raw Data for Update:", rawData);
   console.log("Data to Validate:", dataToValidate);


   const validatedFields = portfolioProjectSchema.safeParse(dataToValidate);

   if (!validatedFields.success) {
       console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors);
       return {
           error: "Validation failed.",
           fieldErrors: validatedFields.error.flatten().fieldErrors,
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
       // TODO: Handle date formatting if necessary for DB
   };


   try {
       const { error } = await supabase
           .from("projects")
           .update(dataForSupabase)
           .eq("id", id);

       if (error) throw error;

       revalidatePath("/dashboard/portfolio");
       revalidatePath(`/dashboard/portfolio/${id}/edit`); // Revalidate the edit page itself
       return { success: true, message: "Project updated successfully!" };

   } catch (error: any) {
       console.error("DB Update Error:", error);
       return { error: `Database Error: ${error.message}` };
   }
}


// --- Delete Portfolio Project Action ---
export async function deletePortfolioProject(projectId: string) {
   const supabase = createClient();

   // Basic validation: Check if user is admin
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) return { error: "Authentication required." };
   const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
   if (profile?.role !== 'admin') return { error: "Admin privileges required." };

   if (!projectId) {
     return { error: "Project ID is required for deletion." };
   }

   try {
     // TODO: Add logic here to delete associated images from storage (UploadThing/Supabase Storage)

     const { error } = await supabase
       .from("projects")
       .delete()
       .eq("id", projectId);

     if (error) throw error;

     revalidatePath("/dashboard/portfolio");
     // No redirect needed usually, the calling component handles UI update
     return { success: true, message: "Project deleted successfully." };

   } catch (error: any) {
     console.error("DB Delete Error:", error);
     return { error: `Database Error: ${error.message}` };
   }
}
