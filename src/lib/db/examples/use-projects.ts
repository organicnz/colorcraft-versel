"use client";

import { useQuery } from "@tanstack/react-query";
import { ProjectService, Project, NewProject } from "./project-service";
import { useOptimisticMutation } from "@/lib/react-query/utils";

export function useProjects(userId?: string) {
  // Make sure queryKey elements are all strings
  const queryKey = ["projects", userId || "all"];

  // Fetch projects
  const {
    data: projects = [],
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => ProjectService.getProjects(userId),
  });

  // Create project with optimistic update
  const createMutation = useOptimisticMutation<
    Project,
    Error,
    Omit<NewProject, "id">,
    { optimisticProject: Project }
  >(queryKey, (newProject) => ProjectService.createProject(newProject), {
    onMutate: async (newProject) => {
      // Create an optimistic project
      const optimisticProject: Project = {
        id: "temp-id-" + Date.now(),
        user_id: userId || newProject.user_id,
        title: newProject.title || "New Project",
        description: newProject.description || "",
        image_url: newProject.image_url || "",
        is_published: newProject.is_published || false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // Return the optimistic project to add to the cache
      return { optimisticProject };
    },
  });

  // Update project with optimistic update
  const updateMutation = useOptimisticMutation<
    Project,
    Error,
    { id: string; project: Partial<Omit<NewProject, "id">> },
    { optimisticProject: Project; existingProject: Project }
  >(queryKey, ({ id, project }) => ProjectService.updateProject(id, project), {
    onMutate: async ({ id, project }) => {
      // Find the existing project
      const existingProject = projects.find((p) => p.id === id);
      if (!existingProject) throw new Error("Project not found");

      // Create the optimistically updated project
      const optimisticProject: Project = {
        ...existingProject,
        ...project,
        updated_at: new Date(),
      };

      return {
        optimisticProject,
        existingProject,
      };
    },
  });

  // Delete project with optimistic update
  const deleteMutation = useOptimisticMutation<
    { success: boolean; id: string },
    Error,
    string,
    { id: string }
  >(queryKey, (id) => ProjectService.deleteProject(id), {
    onMutate: async (id) => {
      // Return the id to remove from the cache
      return { id };
    },
  });

  return {
    projects,
    isLoading,
    error,
    createProject: createMutation.mutate,
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,
  };
}
