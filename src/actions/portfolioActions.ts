"use server"; // Mark this module as Server Actions

import { z } from "zod";
import { createClient } from "@/lib/supabase/server"; // Use server client for actions
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to ensure array parsing for PostgreSQL text[] fields
function ensureArray(value: any): string[] {
  if (!value) return [];

  // If already an array, return as is
  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "string" && item.trim() !== "");
  }

  // If it's a string that looks like a JSON array, try to parse it
  if (typeof value === "string") {
    if (value.trim().startsWith("[") && value.trim().endsWith("]")) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.filter((item) => item && typeof item === "string" && item.trim() !== "")
          : [];
      } catch {
        // If JSON parsing fails, treat as comma-separated
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } else {
      // Treat as comma-separated values
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

// Helper function to convert array data for PostgreSQL storage
function parseToPostgresArray(value: any): string[] {
  return ensureArray(value);
}

// Updated schema to match database structure
export const createPortfolioProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  brief_description: z.string().min(1, "Brief description is required"),
  description: z.string().optional(),
  before_images: z.array(z.string()).default([]),
  after_images: z.array(z.string()).default([]),
  techniques: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  completion_date: z.string().optional(),
  client_name: z.string().optional(),
  client_testimonial: z.string().optional(),
  is_featured: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'archived']).default('draft'),
});

export type PortfolioFormData = z.infer<typeof createPortfolioProjectSchema>;

// --- Create Portfolio Project Action (Auto-generates UUID, starts as draft) ---
export async function createPortfolioProject(formData: FormData) {
  try {
    const supabase = createClient();

    // Verify user authentication and admin role
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "You must be logged in to create portfolio projects" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You do not have permission to create portfolio projects" };
    }

    // Process form data
    const rawData = {
      title: formData.get("title") as string,
      brief_description: formData.get("brief_description") as string,
      description: formData.get("description") as string,
      before_images: parseToPostgresArray(formData.get("before_images") as string),
      after_images: parseToPostgresArray(formData.get("after_images") as string),
      techniques: parseToPostgresArray(formData.get("techniques") as string),
      materials: parseToPostgresArray(formData.get("materials") as string),
      completion_date: formData.get("completion_date") as string,
      client_name: formData.get("client_name") as string,
      client_testimonial: formData.get("client_testimonial") as string,
      is_featured: formData.get("is_featured") === "true",
      status: (formData.get("status") as 'published' | 'draft' | 'archived') || 'draft',
    };

    // Handle status - get from form or use default
    const status = rawData.status || 'draft';

    // Validate using the schema
    const validatedData = createPortfolioProjectSchema.parse(rawData);

    // Create the portfolio project in the database
    const { data, error } = await supabase
      .from("portfolio")
      .insert({
        ...validatedData,
        completion_date: validatedData.completion_date || null,
        created_by: session.user.id,
        updated_by: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Portfolio creation error:", error);
      return { error: "Failed to create portfolio project: " + error.message };
    }

    revalidatePath("/portfolio-dash");
    revalidatePath("/portfolio");

    const statusMessage = data.status === 'published'
      ? "Portfolio project created and published!"
      : "Portfolio project created as draft!";

    return {
      success: true,
      data,
      message: statusMessage,
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      return { error: `Validation error: ${errorMessages}` };
    }

    console.error("Create portfolio error:", error);
    return { error: "Failed to create portfolio project. Please try again." };
  }
}

// --- Update Portfolio Project Action (Handles draft/published state changes) ---
export async function updatePortfolioProject(id: string, formData: FormData) {
  try {
    const supabase = createClient();

    // Verify user authentication and admin role
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "You must be logged in to update portfolio projects" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You do not have permission to update portfolio projects" };
    }

    // Extract and process form data - handle PostgreSQL arrays properly
    const portfolioData: Partial<PortfolioFormData> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      brief_description: (formData.get("brief_description") as string) || undefined,
      before_images: parseToPostgresArray(formData.get("before_images") as string),
      after_images: parseToPostgresArray(formData.get("after_images") as string),
      techniques: parseToPostgresArray(formData.get("techniques") as string),
      materials: parseToPostgresArray(formData.get("materials") as string),
      completion_date: (formData.get("completion_date") as string) || undefined,
      client_name: (formData.get("client_name") as string) || undefined,
      client_testimonial: (formData.get("client_testimonial") as string) || undefined,
      is_featured: formData.get("is_featured") === "true",
      // Handle status - get from form or determine from is_published for backwards compatibility
      status: (formData.get("status") as 'published' | 'draft' | 'archived') ||
              (formData.get("is_published") === "true" ? 'published' : 'draft'),
    };

    const { error, data } = await supabase
      .from("portfolio")
      .update(portfolioData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Portfolio update error:", error);
      return { error: "Failed to update portfolio project: " + error.message };
    }

    revalidatePath("/portfolio-dash");
    revalidatePath("/portfolio");

    const statusMessage = data.status === 'published'
      ? `Portfolio "${data.title}" published successfully`
      : `Portfolio "${data.title}" saved as ${data.status}`;

    return {
      success: true,
      data,
      message: statusMessage,
    };
  } catch (error: any) {
    console.error("Unexpected error updating portfolio:", error);
    return { error: "An unexpected error occurred: " + error.message };
  }
}

// --- Publish Portfolio Project Action (Changes draft to published) ---
export async function publishPortfolioProject(id: string) {
  try {
    const supabase = createClient();

    // Verify user authentication and admin role
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "You must be logged in to publish portfolio projects" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You do not have permission to publish portfolio projects" };
    }

    // Update status to published
    const { error, data } = await supabase
      .from("portfolio")
      .update({
        status: 'published',
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Portfolio publish error:", error);
      return { error: "Failed to publish portfolio project: " + error.message };
    }

    revalidatePath("/portfolio-dash");
    revalidatePath("/portfolio");

    return {
      success: true,
      data,
      message: `Portfolio "${data.title}" published successfully`,
    };
  } catch (error: any) {
    console.error("Publish portfolio error:", error);
    return { error: "Failed to publish portfolio project. Please try again." };
  }
}

// --- Unpublish Portfolio Project Action (Admin only) ---
export async function unpublishPortfolioProject(id: string) {
  try {
    const supabase = createClient();

    // Verify user authentication and admin role
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "You must be logged in to unpublish portfolio projects" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You do not have permission to unpublish portfolio projects" };
    }

    // Update status to draft
    const { error, data } = await supabase
      .from("portfolio")
      .update({
        status: 'draft',
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Portfolio unpublish error:", error);
      return { error: "Failed to unpublish portfolio project: " + error.message };
    }

    revalidatePath("/portfolio-dash");
    revalidatePath("/portfolio");

    return {
      success: true,
      data,
      message: `Portfolio "${data.title}" unpublished successfully`,
    };
  } catch (error: any) {
    console.error("Unpublish portfolio error:", error);
    return { error: "Failed to unpublish portfolio project. Please try again." };
  }
}

// --- Archive Portfolio Project Action (Soft Delete - Admin only) ---
export async function archivePortfolioProject(id: string) {
  try {
    const supabase = createClient();

    // Verify user authentication and admin role
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "You must be logged in to archive portfolio projects" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You do not have permission to archive portfolio projects" };
    }

    // Archive the portfolio record
    const { error, data } = await supabase
      .from("portfolio")
      .update({
        status: 'archived',
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Portfolio archive error:", error);
      return { error: "Failed to archive portfolio project: " + error.message };
    }

    revalidatePath("/portfolio-dash");
    revalidatePath("/portfolio");

    return {
      success: true,
      data,
      message: `Portfolio "${data.title}" archived successfully`,
    };
  } catch (error: any) {
    console.error("Archive portfolio error:", error);
    return { error: "Failed to archive portfolio project. Please try again." };
  }
}

// --- Restore Portfolio Project Action (Unarchive - Admin only) ---
export async function restorePortfolioProject(id: string) {
  try {
    const supabase = createClient();

    // Verify user authentication and admin role
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "You must be logged in to restore portfolio projects" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You do not have permission to restore portfolio projects" };
    }

    // Restore the portfolio record
    const { error, data } = await supabase
      .from("portfolio")
      .update({
        status: 'draft', // Restore as draft by default
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Portfolio restore error:", error);
      return { error: "Failed to restore portfolio project: " + error.message };
    }

    revalidatePath("/portfolio-dash");
    revalidatePath("/portfolio");

    return {
      success: true,
      data,
      message: `Portfolio "${data.title}" restored successfully`,
    };
  } catch (error: any) {
    console.error("Restore portfolio error:", error);
    return { error: "Failed to restore portfolio project. Please try again." };
  }
}

// --- Permanently Delete Portfolio Project Action (Admin only) ---
export async function deletePortfolioProject(id: string) {
  try {
    const supabase = createClient();

    // Verify user authentication and admin role
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return { error: "You must be logged in to delete portfolio projects" };
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You do not have permission to delete portfolio projects" };
    }

    // Get portfolio data first for cleanup and messaging
    const { data: portfolioData, error: fetchError } = await supabase
      .from("portfolio")
      .select("title, before_images, after_images")
      .eq("id", id)
      .single();

    if (fetchError) {
      return { error: "Portfolio project not found" };
    }

    // Delete associated images from storage
    const allImages = [
      ...(portfolioData.before_images || []),
      ...(portfolioData.after_images || []),
    ];
    const filePaths: string[] = [];

    allImages.forEach((imageUrl) => {
      if (imageUrl && imageUrl.includes(`/portfolio/${id}/`)) {
        const urlParts = imageUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];
        filePaths.push(`${id}/${fileName}`);
      }
    });

    if (filePaths.length > 0) {
      const { error: storageError } = await supabase.storage.from("portfolio").remove(filePaths);

      if (storageError) {
        console.warn("Error deleting storage files:", storageError);
        // Continue with database deletion even if storage cleanup fails
      }
    }

    // Permanently delete the portfolio record
    const { error } = await supabase.from("portfolio").delete().eq("id", id);

    if (error) {
      console.error("Portfolio deletion error:", error);
      return { error: "Failed to delete portfolio project: " + error.message };
    }

    revalidatePath("/portfolio-dash");
    revalidatePath("/portfolio");

    return {
      success: true,
      message: `Portfolio "${portfolioData.title}" permanently deleted`,
    };
  } catch (error: any) {
    console.error("Unexpected error deleting portfolio:", error);
    return { error: "An unexpected error occurred: " + error.message };
  }
}

// --- Fetch Portfolio Projects Action ---
export async function fetchPortfolioProjects(filter: "active" | "archived" | "all" = "active") {
  try {
    const supabase = createClient();

    let query = supabase
      .from("portfolio")
      .select(
        `
        *,
        created_by_user:users!portfolio_created_by_fkey(full_name, email),
        updated_by_user:users!portfolio_updated_by_fkey(full_name, email)
      `
      )
      .order("created_at", { ascending: false });

    // Apply filtering based on the requested filter using status field
    if (filter === "active") {
      query = query.in("status", ["published", "draft"]);
    } else if (filter === "archived") {
      query = query.eq("status", "archived");
    }
    // 'all' filter doesn't add any conditions

    const { data: projects, error } = await query;

    if (error) {
      console.error("Error fetching portfolio projects:", error);
      return { error: "Failed to fetch portfolio projects" };
    }

    return { success: true, data: projects || [] };
  } catch (error) {
    console.error("Error fetching portfolio projects:", error);
    return { error: "An unexpected error occurred" };
  }
}
