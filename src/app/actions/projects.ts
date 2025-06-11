"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { projects, Project } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/supabase/server";
import { v4 as uuid } from "uuid";
import { withRateLimit } from "@/lib/rate-limit";
import { apiLogger } from "@/lib/logger";
import { measurePerformance } from "@/lib/logger";

// Define response types for improved client-side handling
export type ActionResponse<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      code: "UNAUTHORIZED" | "VALIDATION" | "NOT_FOUND" | "SERVER_ERROR" | "RATE_LIMITED";
    };

// Validation schema for project creation/updates
const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  is_published: z.boolean().default(false),
});

/**
 * Base implementation of create project action
 */
async function createProjectBase(formData: FormData): Promise<ActionResponse<Project>> {
  return await measurePerformance("createProject", async () => {
    try {
      // Validate user is authenticated
      const {
        data: { session },
      } = await auth();
      if (!session?.user) {
        return {
          success: false,
          error: "You must be logged in to create a project",
          code: "UNAUTHORIZED",
        };
      }

      // Parse and validate form data
      const rawData = Object.fromEntries(formData.entries());

      try {
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

        apiLogger.info(`Project created: ${project.id}`, {
          metadata: {
            userId: session.user.id,
            projectId: project.id,
          },
        });

        return { success: true, data: project };
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errorMessages = validationError.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", ");

          return {
            success: false,
            error: `Validation failed: ${errorMessages}`,
            code: "VALIDATION",
          };
        }
        throw validationError; // Re-throw unexpected validation errors
      }
    } catch (error) {
      apiLogger.error("Failed to create project: " + String(error));
      return {
        success: false,
        error: "An unexpected error occurred",
        code: "SERVER_ERROR",
      };
    }
  });
}

/**
 * Base implementation of update project action
 */
async function updateProjectBase(id: string, formData: FormData): Promise<ActionResponse<Project>> {
  return await measurePerformance("updateProject", async () => {
    try {
      // Validate user is authenticated
      const {
        data: { session },
      } = await auth();
      if (!session?.user) {
        return {
          success: false,
          error: "You must be logged in to update a project",
          code: "UNAUTHORIZED",
        };
      }

      // Check if project exists and belongs to user
      const [existingProject] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, id), eq(projects.user_id, session.user.id)))
        .limit(1);

      if (!existingProject) {
        return {
          success: false,
          error: "Project not found or you don&apos;t have permission to update it",
          code: "NOT_FOUND",
        };
      }

      // Parse and validate form data
      const rawData = Object.fromEntries(formData.entries());

      try {
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

        apiLogger.info(`Project updated: ${id}`, {
          metadata: {
            userId: session.user.id,
            projectId: id,
          },
        });

        return { success: true, data: updatedProject };
      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errorMessages = validationError.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", ");

          return {
            success: false,
            error: `Validation failed: ${errorMessages}`,
            code: "VALIDATION",
          };
        }
        throw validationError; // Re-throw unexpected validation errors
      }
    } catch (error) {
      apiLogger.error(`Failed to update project ${id}: ` + String(error));
      return {
        success: false,
        error: "An unexpected error occurred",
        code: "SERVER_ERROR",
      };
    }
  });
}

/**
 * Base implementation of delete project action
 */
async function deleteProjectBase(id: string): Promise<ActionResponse<{ id: string }>> {
  return await measurePerformance("deleteProject", async () => {
    try {
      // Validate user is authenticated
      const {
        data: { session },
      } = await auth();
      if (!session?.user) {
        return {
          success: false,
          error: "You must be logged in to delete a project",
          code: "UNAUTHORIZED",
        };
      }

      // Check if project exists and belongs to user
      const [existingProject] = await db
        .select()
        .from(projects)
        .where(and(eq(projects.id, id), eq(projects.user_id, session.user.id)))
        .limit(1);

      if (!existingProject) {
        return {
          success: false,
          error: "Project not found or you don&apos;t have permission to delete it",
          code: "NOT_FOUND",
        };
      }

      // Delete project from database
      await db.delete(projects).where(eq(projects.id, id));

      // Revalidate cache
      revalidatePath("/dashboard/portfolio");

      apiLogger.info(`Project deleted: ${id}`, {
        metadata: {
          userId: session.user.id,
          projectId: id,
        },
      });

      return { success: true, data: { id } };
    } catch (error) {
      apiLogger.error(`Failed to delete project ${id}: ` + String(error));
      return {
        success: false,
        error: "An unexpected error occurred",
        code: "SERVER_ERROR",
      };
    }
  });
}

// Apply rate limiting to server actions
export const createProject = withRateLimit(createProjectBase, {
  limit: 10, // 10 creations per minute
  windowInSeconds: 60,
  identifier: "createProject",
});

export const updateProject = withRateLimit(updateProjectBase, {
  limit: 20, // 20 updates per minute
  windowInSeconds: 60,
  identifier: "updateProject",
});

export const deleteProject = withRateLimit(deleteProjectBase, {
  limit: 5, // 5 deletions per minute
  windowInSeconds: 60,
  identifier: "deleteProject",
});
