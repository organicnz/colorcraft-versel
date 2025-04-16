"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { createPortfolioProject, updatePortfolioProject } from '@/actions/portfolioActions';

// Define form validation schema
// Note: We'll use a simplified schema for client-side validation
const formSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  brief_description: z.string().min(1, "Brief description is required"),
  description: z.string().optional(),
  // For demo purposes, we're using text fields for images
  // In a real app, you would use a file upload component
  before_images: z.string().min(1, "At least one 'before' image URL is required"),
  after_images: z.string().min(1, "At least one 'after' image URL is required"),
  techniques: z.string().optional(),
  materials: z.string().optional(),
  // completion_date: z.date().optional(),
  completion_date: z.string().optional(),
  client_name: z.string().optional(),
  client_testimonial: z.string().optional(),
  is_featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface PortfolioFormProps {
  project?: any; // Use the Project type from PortfolioTable or define it here
}

export default function PortfolioForm({ project }: PortfolioFormProps = {}) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const isEditing = !!project?.id;

  // Define form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: project?.id || undefined,
      title: project?.title || "",
      brief_description: project?.brief_description || "",
      description: project?.description || "",
      before_images: project?.before_images?.join(", ") || "",
      after_images: project?.after_images?.join(", ") || "",
      techniques: project?.techniques?.join(", ") || "",
      materials: project?.materials?.join(", ") || "",
      completion_date: project?.completion_date || "",
      client_name: project?.client_name || "",
      client_testimonial: project?.client_testimonial || "",
      is_featured: project?.is_featured ?? false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);

    try {
      // Convert comma-separated strings to arrays
      const formData = new FormData();
      
      // Add all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          // Handle arrays: convert comma-separated strings to array items
          if (['before_images', 'after_images', 'techniques', 'materials'].includes(key) && typeof value === 'string') {
            const items = value.split(',').map(item => item.trim()).filter(Boolean);
            items.forEach(item => {
              formData.append(`${key}[]`, item);
            });
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      // Call the appropriate server action based on whether we're editing or creating
      const result = isEditing 
        ? await updatePortfolioProject(formData)
        : await createPortfolioProject(formData);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Project updated successfully!" : "Project created successfully!");
        router.push("/dashboard/portfolio");
        router.refresh();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Project ID - Hidden field for editing */}
        {isEditing && (
          <input type="hidden" name="id" value={project.id} />
        )}

        {/* Basic Project Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Project Information</h2>
          <Separator />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input placeholder="Vintage Dresser Restoration" {...field} />
                </FormControl>
                <FormDescription>The name of your furniture project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brief_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A short description that appears on the portfolio list view" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>A short summary (1-2 sentences)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A detailed description of the project, techniques used, and the transformation process." 
                    rows={5}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Detailed information about the project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Project Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Project Details</h2>
          <Separator />

          <FormField
            control={form.control}
            name="techniques"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Techniques Used</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Distressing, Chalk Paint, Staining" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Comma-separated list of techniques used in this project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="materials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Materials Used</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Chalk Paint, Beeswax Finish, Brass Hardware" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Comma-separated list of materials used</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="completion_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Completion Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Images</h2>
          <Separator />
          <FormDescription className="text-amber-600">
            Note: In this demo, we're using URLs instead of actual file uploads.
            In a real application, you would implement proper image upload functionality.
          </FormDescription>

          <FormField
            control={form.control}
            name="before_images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>"Before" Images</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Comma-separated list of image URLs showing the furniture before restoration</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="after_images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>"After" Images</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="https://example.com/image1-after.jpg, https://example.com/image2-after.jpg" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Comma-separated list of image URLs showing the completed project</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Client Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Client Information (Optional)</h2>
          <Separator />

          <FormField
            control={form.control}
            name="client_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormDescription>The client's name (leave blank to keep anonymous)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_testimonial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Testimonial</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="What the client said about the project" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Display Settings */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Display Settings</h2>
          <Separator />

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Feature this project</FormLabel>
                  <FormDescription>
                    Featured projects appear at the top of your portfolio
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/dashboard/portfolio")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Project" : "Add Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 