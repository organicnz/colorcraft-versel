"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"

type Project = Database["public"]["Tables"]["projects"]["Row"]

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  brief_description: z.string().min(1, "Brief description is required"),
  before_images: z.array(z.string()).min(1, "At least one before image is required"),
  after_images: z.array(z.string()).min(1, "At least one after image is required"),
  techniques: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  completion_date: z.string().optional(),
  client_name: z.string().optional(),
  client_testimonial: z.string().optional(),
  is_featured: z.boolean().default(false),
})

type PortfolioFormData = z.infer<typeof portfolioSchema>

interface PortfolioFormProps {
  initialData?: Partial<Project>
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PortfolioForm({ 
  initialData, 
  onSuccess, 
  onCancel 
}: PortfolioFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  
  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      brief_description: initialData?.brief_description || "",
      before_images: initialData?.before_images || [],
      after_images: initialData?.after_images || [],
      techniques: initialData?.techniques || [],
      materials: initialData?.materials || [],
      completion_date: initialData?.completion_date || "",
      client_name: initialData?.client_name || "",
      client_testimonial: initialData?.client_testimonial || "",
      is_featured: initialData?.is_featured || false,
    },
  })

  async function onSubmit(values: PortfolioFormData) {
    setIsLoading(true)
    
    try {
      if (initialData?.id) {
        // Update existing project
        const { error } = await supabase
          .from("projects")
          .update(values)
          .eq("id", initialData.id)
          
        if (error) throw error
      } else {
        // Create new project
        const { error } = await supabase
          .from("projects")
          .insert(values)
          
        if (error) throw error
      }
      
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error saving portfolio project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Portfolio Project" : "Add New Portfolio Project"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Project Title *
            </label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter project title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-600">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="brief_description" className="text-sm font-medium">
              Brief Description *
            </label>
            <Textarea
              id="brief_description"
              {...form.register("brief_description")}
              placeholder="Brief description for portfolio grid"
              rows={2}
            />
            {form.formState.errors.brief_description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.brief_description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Full Description
            </label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Detailed project description"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="client_name" className="text-sm font-medium">
              Client Name
            </label>
            <Input
              id="client_name"
              {...form.register("client_name")}
              placeholder="Client or project owner name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="client_testimonial" className="text-sm font-medium">
              Client Testimonial
            </label>
            <Textarea
              id="client_testimonial"
              {...form.register("client_testimonial")}
              placeholder="What the client said about the project"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="completion_date" className="text-sm font-medium">
              Completion Date
            </label>
            <Input
              id="completion_date"
              type="date"
              {...form.register("completion_date")}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_featured"
              type="checkbox"
              {...form.register("is_featured")}
              className="w-4 h-4"
            />
            <label htmlFor="is_featured" className="text-sm font-medium">
              Featured Project
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData?.id ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 