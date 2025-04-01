"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/supabase/server";
import { v4 as uuid } from "uuid";

// Validation schema for project creation/updates
const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  is_published: z.boolean().default(false),
});

// Create project action
export async function createProject(formData: FormData) {
  try {
    // Validate user is authenticated
    const { data: { session } } = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }
    
    // Parse and validate form data
    const rawData = Object.fromEntries(formData.entries());
    const validated = projectSchema.parse({
      title: rawData.title,
      description: rawData.description || "",
      image_url: rawData.image_url || null,
      is_published: rawData.is_published === "true",
    });
    
    // Create new project in database
    const projectId = uuid();
    const [project] = await db
      .insert(projects)
      .values({
        id: projectId,
        user_id: session.user.id,
        ...validated,
      })
      .returning();
    
    // Revalidate cache
    revalidatePath("/dashboard/portfolio");
    
    return { data: project };
  } catch (error) {
    console.error("Failed to create project:", error);
    if (error instanceof z.ZodError) {
      return { error: error.errors };
    }
    return { error: "Failed to create project" };
  }
}

// Update project action
export async function updateProject(id: string, formData: FormData) {
  try {
    // Validate user is authenticated
    const { data: { session } } = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }
    
    // Check if project exists and belongs to user
    const [existingProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
      
    if (!existingProject) {
      return { error: "Project not found" };
    }
    
    if (existingProject.user_id !== session.user.id) {
      return { error: "Unauthorized" };
    }
    
    // Parse and validate form data
    const rawData = Object.fromEntries(formData.entries());
    const validated = projectSchema.parse({
      title: rawData.title,
      description: rawData.description || "",
      image_url: rawData.image_url || null,
      is_published: rawData.is_published === "true",
    });
    
    // Update project in database
    const [updatedProject] = await db
      .update(projects)
      .set({
        ...validated,
        updated_at: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();
    
    // Revalidate cache
    revalidatePath(`/dashboard/portfolio/${id}`);
    revalidatePath("/dashboard/portfolio");
    
    return { data: updatedProject };
  } catch (error) {
    console.error(`Failed to update project ${id}:`, error);
    if (error instanceof z.ZodError) {
      return { error: error.errors };
    }
    return { error: "Failed to update project" };
  }
}

// Delete project action
export async function deleteProject(id: string) {
  try {
    // Validate user is authenticated
    const { data: { session } } = await auth();
    if (!session?.user) {
      return { error: "Unauthorized" };
    }
    
    // Check if project exists and belongs to user
    const [existingProject] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
      
    if (!existingProject) {
      return { error: "Project not found" };
    }
    
    if (existingProject.user_id !== session.user.id) {
      return { error: "Unauthorized" };
    }
    
    // Delete project from database
    await db
      .delete(projects)
      .where(eq(projects.id, id));
    
    // Revalidate cache
    revalidatePath("/dashboard/portfolio");
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete project ${id}:`, error);
    return { error: "Failed to delete project" };
  }
}
