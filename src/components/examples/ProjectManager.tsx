"use client";

import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { createProject, updateProject, deleteProject } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash, Plus, Pencil } from "lucide-react";

// Project type definition
type Project = {
  id: string;
  title: string;
  description?: string;
  image_url?: string | null;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
  user_id: string;
};

export default function ProjectManager() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_published: false,
  });

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      // This would normally be a fetch call to your API
      // For demo purposes, we&apos;ll return mock data
      return [
        {
          id: "1",
          title: "Modern Website Redesign",
          description:
            "A complete overhaul of the client's website with a focus on modern design principles.",
          image_url: null,
          is_published: true,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: "user1",
        },
        {
          id: "2",
          title: "Brand Identity Package",
          description: "Logo design, color palette, and brand guidelines for a new startup.",
          image_url: null,
          is_published: false,
          created_at: new Date(),
          updated_at: new Date(),
          user_id: "user1",
        },
      ] as Project[];
    },
  });

  // Create project mutation with optimistic updates
  const createProjectMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createProject(formData);
      if (result.error) throw new Error(result.error as string);
      return result.data;
    },
    onMutate: async (formData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<Project[]>(["projects"]) || [];

      // Create optimistic project
      const optimisticProject: Project = {
        id: `temp-${Date.now()}`,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        image_url: null,
        is_published: formData.get("is_published") === "true",
        created_at: new Date(),
        updated_at: new Date(),
        user_id: "current-user", // In a real app, this would be the actual user ID
      };

      // Optimistically update to the new value
      queryClient.setQueryData<Project[]>(["projects"], (old) =>
        old ? [optimisticProject, ...old] : [optimisticProject]
      );

      // Return the context
      return { previousProjects };
    },
    onError: (err, newProject, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData<Project[]>(["projects"], context.previousProjects);
      }
      toast({
        title: "Error",
        description: "Failed to create project.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Reset the form after successful creation
      setFormData({ title: "", description: "", is_published: false });
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to make sure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Delete project mutation with optimistic updates
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProject(id);
      if (result.error) throw new Error(result.error as string);
      return result;
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<Project[]>(["projects"]) || [];

      // Optimistically remove the project
      queryClient.setQueryData<Project[]>(["projects"], (old) =>
        old ? old.filter((project) => project.id !== id) : []
      );

      // Return the context
      return { previousProjects };
    },
    onError: (err, id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData<Project[]>(["projects"], context.previousProjects);
      }
      toast({
        title: "Error",
        description: "Failed to delete project.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project deleted successfully!",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to make sure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Update project mutation with optimistic updates
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const result = await updateProject(id, formData);
      if (result.error) throw new Error(result.error as string);
      return result.data;
    },
    onMutate: async ({ id, formData }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<Project[]>(["projects"]) || [];

      // Find the project being updated
      const projectIndex = previousProjects.findIndex((p) => p.id === id);
      if (projectIndex === -1) return { previousProjects };

      // Create a copy of the projects array
      const updatedProjects = [...previousProjects];

      // Update the project with optimistic values
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        is_published: formData.get("is_published") === "true",
        updated_at: new Date(),
      };

      // Optimistically update to the new value
      queryClient.setQueryData<Project[]>(["projects"], updatedProjects);

      // Return the context
      return { previousProjects };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousProjects) {
        queryClient.setQueryData<Project[]>(["projects"], context.previousProjects);
      }
      toast({
        title: "Error",
        description: "Failed to update project.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setEditingId(null);
      toast({
        title: "Success",
        description: "Project updated successfully!",
      });
    },
    onSettled: () => {
      // Always refetch after error or success to make sure cache is in sync with server
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Handle creating a new project
  const handleCreateProject = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("is_published", formData.is_published.toString());
      createProjectMutation.mutate(form);
    },
    [formData, createProjectMutation]
  );

  // Handle updating a project
  const handleUpdateProject = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingId) return;

      const form = new FormData();
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("is_published", formData.is_published.toString());

      updateProjectMutation.mutate({ id: editingId, formData: form });
    },
    [editingId, formData, updateProjectMutation]
  );

  // Handle starting to edit a project
  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      description: project.description || "",
      is_published: project.is_published,
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", is_published: false });
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Project Manager</h1>

      {/* Project Form */}
      <form
        onSubmit={editingId ? handleUpdateProject : handleCreateProject}
        className="bg-card p-4 rounded-lg shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Project" : "Create New Project"}
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Project title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Project description"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_published"
              name="is_published"
              type="checkbox"
              checked={formData.is_published}
              onChange={handleCheckboxChange}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="is_published" className="text-sm font-medium">
              Publish this project
            </label>
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          <Button
            type="submit"
            disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
          >
            {(createProjectMutation.isPending || updateProjectMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {editingId ? "Update Project" : "Create Project"}
          </Button>

          {editingId && (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {/* Projects List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No projects found. Create your first project!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border ${
                  project.is_published
                    ? "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
                    : "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description || "No description provided"}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.is_published
                            ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {project.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(project)}
                      disabled={deleteProjectMutation.isPending}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProjectMutation.mutate(project.id)}
                      disabled={deleteProjectMutation.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      {deleteProjectMutation.isPending &&
                      deleteProjectMutation.variables === project.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
