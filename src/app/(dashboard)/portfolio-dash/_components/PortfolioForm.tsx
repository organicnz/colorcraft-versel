"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
import {
  createPortfolioProject,
  updatePortfolioProject,
  publishPortfolioProject,
  unpublishPortfolioProject,
} from "@/actions/portfolioActions";
import {
  CalendarIcon,
  ImageIcon,
  Wrench,
  Palette,
  User,
  Star,
  Quote,
  Save,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define portfolio schema matching the database structure with draft/published states
const portfolioSchema = z.object({
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
  status: z.enum(['published', 'draft', 'archived']).default('draft'),
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;

interface PortfolioFormProps {
  initialData?: Partial<PortfolioFormData>;
  isEditing?: boolean;
}

// Helper function to ensure array parsing
function ensureArray(value: any): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "string" && item.trim() !== "");
  }

  if (typeof value === "string") {
    if (value.trim().startsWith("[") && value.trim().endsWith("]")) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.filter((item) => item && typeof item === "string" && item.trim() !== "")
          : [];
      } catch {
        return value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } else {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

// Helper function to parse comma-separated arrays
function parseArrayField(value: string): string[] {
  console.log("🔍 parseArrayField input:", value);
  if (!value || value.trim() === "") {
    console.log("🔍 parseArrayField: empty value, returning []");
    return [];
  }
  const result = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  console.log("🔍 parseArrayField result:", result);
  return result;
}

export default function PortfolioForm({ initialData, isEditing = false }: PortfolioFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [portfolioId, setPortfolioId] = useState<string>(initialData?.id || "");
  const [isDraft, setIsDraft] = useState(initialData?.status === 'draft');
  const [isPublished, setIsPublished] = useState(initialData?.status === 'published');
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      id: initialData?.id || "",
      title: initialData?.title || "",
      brief_description: initialData?.brief_description || "",
      description: initialData?.description || "",
      before_images: ensureArray(initialData?.before_images),
      after_images: ensureArray(initialData?.after_images),
      techniques: ensureArray(initialData?.techniques),
      materials: ensureArray(initialData?.materials),
      completion_date: initialData?.completion_date || "",
      client_name: initialData?.client_name || "",
      client_testimonial: initialData?.client_testimonial || "",
      is_featured: initialData?.is_featured || false,
      status: (initialData?.status || 'draft') as 'published' | 'draft' | 'archived',
    },
  });

  // Watch form values to sync with local state
  const watchedIsPublished = form.watch("status");
  const watchedIsDraft = form.watch("status");

  useEffect(() => {
    setIsPublished(watchedIsPublished === 'published');
    setIsDraft(watchedIsPublished === 'draft');
  }, [watchedIsPublished]);

  const onSubmit = async (data: PortfolioFormData) => {
    setIsSubmitting(true);
    console.log("🔍 Form submit data:", data);
    console.log("🔍 Techniques array:", data.techniques);
    console.log("🔍 Materials array:", data.materials);

    try {
      const formData = new FormData();

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (
          key === "before_images" ||
          key === "after_images" ||
          key === "techniques" ||
          key === "materials"
        ) {
          // Convert arrays to comma-separated strings for FormData
          const arrayValue = Array.isArray(value) ? value.join(", ") : String(value || "");
          console.log(`🔍 FormData ${key}:`, arrayValue);
          formData.append(key, arrayValue);
        } else if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else {
          formData.append(key, String(value || ""));
        }
      });

      let result;
      if (isEditing && portfolioId) {
        result = await updatePortfolioProject(portfolioId, formData);
      } else {
        result = await createPortfolioProject(formData);
        // For new projects, get the generated UUID
        if (result.success && result.data?.id) {
          setPortfolioId(result.data.id);
        }
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message || "Portfolio saved successfully!");
        if (!isEditing) {
          // Redirect to edit mode for new projects so they can upload images
          router.push(`/portfolio-dash/${result.data.id}/edit`);
        } else {
          router.push("/portfolio-dash");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!portfolioId) {
      toast.error("Please save the portfolio first before publishing");
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (isPublished) {
        result = await unpublishPortfolioProject(portfolioId);
      } else {
        result = await publishPortfolioProject(portfolioId);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.message);
        setIsPublished(result.data.status === 'published');
        setIsDraft(result.data.status === 'draft');
        form.setValue("status", result.data.status);
      }
    } catch (error) {
      console.error("Publish toggle error:", error);
      toast.error("Failed to update publication status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImagesChange = (category: "before" | "after", images: string[]) => {
    if (category === "before") {
      form.setValue("before_images", images);
    } else {
      form.setValue("after_images", images);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header with Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {isEditing ? "Edit Portfolio Project" : "Create Portfolio Project"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isEditing
              ? "Update your portfolio project details and manage publication status"
              : "Start creating a new portfolio project. It will be saved as a draft with a unique UUID."}
          </p>
        </div>

        {portfolioId && (
          <div className="flex items-center gap-3">
            <Badge variant={isPublished ? "default" : "secondary"} className="px-3 py-1">
              {isPublished ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Published
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Draft
                </>
              )}
            </Badge>

            {isEditing && (
              <Button
                type="button"
                variant={isPublished ? "outline" : "default"}
                onClick={handlePublishToggle}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isPublished ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Publish
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Portfolio UUID Display */}
      {portfolioId && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Portfolio UUID</p>
                <p className="text-xs text-blue-700 font-mono">{portfolioId}</p>
              </div>
              <div className="text-xs text-blue-600">
                <p>Storage Path: portfolio/{portfolioId}/</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                                Draft
                              </Badge>
                              <span>Working on it</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="published">
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800">
                                Published
                              </Badge>
                              <span>Visible to public</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="archived">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                                Archived
                              </Badge>
                              <span>Hidden from public</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="brief_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Brief Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A short, compelling summary of this project..."
                        className="min-h-[80px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A concise overview that will appear in portfolio previews (1-2 sentences)
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
                    <FormLabel className="text-base font-medium">Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the project, process, and results..."
                        className="min-h-[120px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Full project details, techniques used, challenges overcome, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          {portfolioId && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Upload className="h-5 w-5 text-green-600" />
                  Project Images
                </CardTitle>
                <p className="text-sm text-slate-600">
                  Upload before and after images for your portfolio project. Images are organized
                  automatically in your portfolio directory.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Before Images */}
                <div>
                  <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-orange-500" />
                    Before Images
                  </h3>
                  <ImageUpload
                    portfolioId={portfolioId}
                    category="before"
                    onImagesChange={(images) => handleImagesChange("before", images)}
                    initialImages={form.watch("before_images")}
                    maxImages={10}
                  />
                </div>

                {/* After Images */}
                <div>
                  <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-green-500" />
                    After Images
                  </h3>
                  <ImageUpload
                    portfolioId={portfolioId}
                    category="after"
                    onImagesChange={(images) => handleImagesChange("after", images)}
                    initialImages={form.watch("after_images")}
                    maxImages={10}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Details */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wrench className="h-5 w-5 text-orange-600" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="techniques"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Techniques Used
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Type techniques separated by commas (e.g., Chalk Paint, Distressing, Staining, French Polish)"
                            value={
                              Array.isArray(field.value)
                                ? field.value.join(", ")
                                : field.value
                                  ? String(field.value)
                                  : ""
                            }
                            onChange={(e) => {
                              console.log("🔍 Techniques input value:", e.target.value);
                              console.log("🔍 Current field value:", field.value);
                              const parsed = parseArrayField(e.target.value);
                              console.log("🔍 Calling field.onChange with:", parsed);
                              field.onChange(parsed);
                            }}
                            className="text-base pr-12"
                          />
                          {field.value && Array.isArray(field.value) && field.value.length > 0 && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Badge variant="secondary" className="text-xs">
                                {field.value.length}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          💡 Tip: Type your techniques and separate them with commas. Press Enter or Tab to see them as individual tags.
                        </div>
                        {field.value && Array.isArray(field.value) && field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md border">
                            {field.value.map((technique, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                              >
                                {technique}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Materials Used
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Type materials separated by commas (e.g., Sandpaper, Primer, Wood Stain, Brass Hardware)"
                            value={
                              Array.isArray(field.value)
                                ? field.value.join(", ")
                                : field.value
                                  ? String(field.value)
                                  : ""
                            }
                            onChange={(e) => {
                              console.log("🔍 Materials input value:", e.target.value);
                              console.log("🔍 Current field value:", field.value);
                              const parsed = parseArrayField(e.target.value);
                              console.log("🔍 Calling field.onChange with:", parsed);
                              field.onChange(parsed);
                            }}
                            className="text-base pr-12"
                          />
                          {field.value && Array.isArray(field.value) && field.value.length > 0 && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Badge variant="secondary" className="text-xs">
                                {field.value.length}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          💡 Tip: Type your materials and separate them with commas. Press Enter or Tab to see them as individual tags.
                        </div>
                        {field.value && Array.isArray(field.value) && field.value.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-2 bg-muted/50 rounded-md border">
                            {field.value.map((material, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-green-50 text-green-700 border-green-200"
                              >
                                {material}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="completion_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Completion Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="text-base" />
                    </FormControl>
                    <FormDescription>When was this project completed?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-purple-600" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Client Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sarah Johnson" {...field} className="text-base" />
                    </FormControl>
                    <FormDescription>Client's name (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_testimonial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <Quote className="h-4 w-4" />
                      Client Testimonial
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share what the client said about the project..."
                        className="min-h-[100px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A quote or feedback from the client (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5 text-yellow-600" />
                Project Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base font-medium">Featured Project</FormLabel>
                      <FormDescription>
                        Mark this project as featured to highlight it in your portfolio gallery
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => router.push("/portfolio-dash")}>
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : isEditing ? "Update Portfolio" : "Create Draft"}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Save Notice for New Projects */}
      {!isEditing && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <Upload className="w-4 h-4" />
              <p className="text-sm font-medium">
                New projects are automatically saved as drafts with a unique UUID. After saving,
                you'll be able to upload images.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
