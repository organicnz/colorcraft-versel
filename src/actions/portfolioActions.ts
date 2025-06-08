"use server"; // Mark this module as Server Actions

import { z } from "zod";
import { createClient } from "@/lib/supabase/server"; // Use server client for actions
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to parse comma-separated strings OR arrays into PostgreSQL text[] format
function parseToPostgresArray(input: string | string[] | null | undefined): string[] {
  if (!input) return [];

  // If it's already an array, return it
  if (Array.isArray(input)) {
    return input.filter(Boolean);
  }

  // If it's a string, parse it as comma-separated
  return input.split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

// Enhanced validation schema for portfolio projects
const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  brief_description: z.string().optional(),
  before_images: z.array(z.string()).default([]),
  after_images: z.array(z.string()).default([]),
  techniques: z.array(z.string()).default([]),
  materials: z.array(z.string()).default([]),
  project_duration: z.string().optional(),
  challenges_faced: z.string().optional(),
  client_satisfaction: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  completion_date: z.string().optional(),
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;

// --- Create Portfolio Project Action ---
export async function createPortfolioProject(formData: FormData) {
  try {
    const supabase = await createClient();

    // Basic validation: Check if user is admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { error: "You must be logged in to create portfolio projects" };
    }

    // Get user data and verify admin role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      return { error: "You do not have permission to create portfolio projects" };
    }

    // Extract and validate form data - handle PostgreSQL arrays properly
    const portfolioData: Partial<PortfolioFormData> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      brief_description: formData.get("brief_description") as string || undefined,
      before_images: parseToPostgresArray(formData.get("before_images") as string),
      after_images: parseToPostgresArray(formData.get("after_images") as string),
      techniques: parseToPostgresArray(formData.get("techniques") as string),
      materials: parseToPostgresArray(formData.get("materials") as string),
      project_duration: formData.get("project_duration") as string || undefined,
      challenges_faced: formData.get("challenges_faced") as string || undefined,
      client_satisfaction: formData.get("client_satisfaction") as string || undefined,
      is_featured: formData.get("is_featured") === "true",
      is_published: formData.get("is_published") === "true",
      completion_date: formData.get("completion_date") as string || undefined,
    };

    // Insert into PostgreSQL - arrays will be automatically converted to text[]
    const { error, data } = await supabase
      .from("portfolio")
      .insert([portfolioData])
      .select()
      .single();

    if (error) {
      console.error("Portfolio creation error:", error);
      return { error: "Failed to create portfolio project: " + error.message };
    }

    revalidatePath("/portfolio-dash");
    return { success: "Portfolio project created successfully", data };
  } catch (error) {
    console.error("Portfolio creation error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// --- Update Portfolio Project Action ---
export async function updatePortfolioProject(id: string, formData: FormData) {
  try {
    const supabase = await createClient();

    // Verify user authentication and admin role
    const { data: { session } } = await supabase.auth.getSession();
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
      brief_description: formData.get("brief_description") as string || undefined,
      before_images: parseToPostgresArray(formData.get("before_images") as string),
      after_images: parseToPostgresArray(formData.get("after_images") as string),
      techniques: parseToPostgresArray(formData.get("techniques") as string),
      materials: parseToPostgresArray(formData.get("materials") as string),
      project_duration: formData.get("project_duration") as string || undefined,
      challenges_faced: formData.get("challenges_faced") as string || undefined,
      client_satisfaction: formData.get("client_satisfaction") as string || undefined,
      is_featured: formData.get("is_featured") === "true",
      is_published: formData.get("is_published") === "true",
      completion_date: formData.get("completion_date") as string || undefined,
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
    revalidatePath(`/portfolio/${id}`);
    return { success: "Portfolio project updated successfully", data };
  } catch (error) {
    console.error("Portfolio update error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// --- Delete Portfolio Project Action ---
export async function deletePortfolioProject(id: string) {
  try {
    const supabase = await createClient();

    // Verify user authentication and admin role
    const { data: { session } } = await supabase.auth.getSession();
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

    const { error } = await supabase
      .from("portfolio")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Portfolio deletion error:", error);
      return { error: "Failed to delete portfolio project" };
    }

    revalidatePath("/portfolio-dash");
    return { success: "Portfolio project deleted successfully" };
  } catch (error) {
    console.error("Portfolio deletion error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// --- Fetch Portfolio Projects Action ---
export async function fetchPortfolioProjects() {
  try {
    const supabase = await createClient();

    const { data: projects, error } = await supabase
      .from("portfolio")
      .select("*")
      .order("created_at", { ascending: false });

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
