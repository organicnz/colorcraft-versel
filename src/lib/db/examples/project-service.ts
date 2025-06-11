import { db } from "../index";
import { projects } from "../schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";

// Types based on our schema
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

// Service layer for Project CRUD operations
export const ProjectService = {
  // Get all projects
  async getProjects(userId?: string) {
    try {
      if (userId) {
        return await db.select().from(projects).where(eq(projects.user_id, userId));
      }
      return await db.select().from(projects);
    } catch (error) {
      console.error("Error getting projects:", error);
      throw new Error("Failed to fetch projects");
    }
  },

  // Get a single project by ID
  async getProjectById(id: string) {
    try {
      const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
      return result[0];
    } catch (error) {
      console.error(`Error getting project ${id}:`, error);
      throw new Error("Failed to fetch project");
    }
  },

  // Create a new project
  async createProject(project: Omit<NewProject, "id">) {
    try {
      const newId = uuid();
      const result = await db
        .insert(projects)
        .values({ ...project, id: newId })
        .returning();
      return result[0];
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  },

  // Update an existing project
  async updateProject(id: string, project: Partial<Omit<NewProject, "id">>) {
    try {
      const result = await db
        .update(projects)
        .set({ ...project, updated_at: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw new Error("Failed to update project");
    }
  },

  // Delete a project
  async deleteProject(id: string) {
    try {
      await db.delete(projects).where(eq(projects.id, id));
      return { success: true, id };
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw new Error("Failed to delete project");
    }
  },
};
