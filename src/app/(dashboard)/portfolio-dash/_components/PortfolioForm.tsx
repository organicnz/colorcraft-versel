"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPortfolioProject, updatePortfolioProject } from "@/actions/portfolioActions";
import { CalendarIcon, ImageIcon, Wrench, Palette, User, Star, Quote } from "lucide-react";

// Define portfolio schema matching the database structure
export const portfolioSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
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
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface PortfolioFormProps {
  initialData?: PortfolioFormData;
  isEditing?: boolean;
}

export default function PortfolioForm({ initialData, isEditing = false }: PortfolioFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(portfolioSchema),
    defaultValues: initialData || {
      title: "",
      brief_description: "",
      description: "",
      before_images: [],
      after_images: [],
      techniques: [],
      materials: [],
      completion_date: "",
      client_name: "",
      client_testimonial: "",
      is_featured: false,
    },
  });

  // Helper function to convert array strings to actual arrays
  const parseArrayField = (value: string): string[] => {
    if (!value.trim()) return [];
    return value.split(',').map(item => item.trim()).filter(Boolean);
  };

  async function onSubmit(values: PortfolioFormData) {
    setIsSubmitting(true);
    try {
      // Convert to FormData for server action
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      let result;
      if (isEditing && initialData?.id) {
        result = await updatePortfolioProject(initialData.id, formData);
      } else {
        result = await createPortfolioProject(formData);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Project updated successfully" : "Project created successfully");
        router.push("/portfolio-dash");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Vintage Dresser Restoration" {...field} />
                    </FormControl>
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
                        placeholder="Short, compelling summary of the project"
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed in project cards and previews
                    </FormDescription>
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
                        placeholder="Detailed project description, process, and results"
                        className="min-h-32"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Comprehensive details about the project, techniques used, and outcomes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Project Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="before_images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Before Images</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter image URLs, one per line or comma-separated"
                        className="min-h-20"
                        value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                        onChange={(e) => {
                          const urls = e.target.value.split(/[\n,]+/).map(url => url.trim()).filter(Boolean);
                          field.onChange(urls);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Add URLs of before images. Enter one URL per line or separate with commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="after_images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>After Images</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter image URLs, one per line or comma-separated"
                        className="min-h-20"
                        value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                        onChange={(e) => {
                          const urls = e.target.value.split(/[\n,]+/).map(url => url.trim()).filter(Boolean);
                          field.onChange(urls);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Add URLs of after/completed images. Enter one URL per line or separate with commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="techniques"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Techniques Used</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Sanding, Priming, Chalk Paint, Distressing"
                        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                        onChange={(e) => {
                          const techniques = parseArrayField(e.target.value);
                          field.onChange(techniques);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      List the techniques used in this project, separated by commas
                    </FormDescription>
                    {field.value && field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((technique, index) => (
                          <Badge key={index} variant="secondary">{technique}</Badge>
                        ))}
                      </div>
                    )}
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
                        placeholder="e.g., Chalk Paint, Wood Stain, New Hardware, Fabric"
                        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                        onChange={(e) => {
                          const materials = parseArrayField(e.target.value);
                          field.onChange(materials);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      List the materials used in this project, separated by commas
                    </FormDescription>
                    {field.value && field.value.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((material, index) => (
                          <Badge key={index} variant="outline">{material}</Badge>
                        ))}
                      </div>
                    )}
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
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      When was this project completed?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Client's name (optional)"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      The name of the client for this project (can be left blank for privacy)
                    </FormDescription>
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
                        placeholder="What did the client say about the project?"
                        className="min-h-24"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      A testimonial or review from the client about the completed project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Project Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Project Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                      <FormLabel>Featured Project</FormLabel>
                      <FormDescription>
                        Featured projects will be highlighted on the homepage and portfolio page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/portfolio-dash")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Project"
                : "Create Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 