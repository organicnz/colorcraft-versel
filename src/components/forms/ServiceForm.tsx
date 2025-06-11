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

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  brief_description: z.string().min(1, "Brief description is required"),
  image_url: z.string().optional(),
  price_range: z.string().optional(),
  is_active: z.boolean().default(true),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface Service {
  id: string
  name: string
  description: string
  brief_description: string
  image_url?: string | null
  price_range?: string | null
  is_active: boolean
  created_at?: string
  updated_at?: string
}

interface ServiceFormProps {
  initialData?: Partial<Service>
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ServiceForm({ 
  initialData, 
  onSuccess, 
  onCancel 
}: ServiceFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      brief_description: initialData?.brief_description || "",
      image_url: initialData?.image_url || "",
      price_range: initialData?.price_range || "",
      is_active: initialData?.is_active ?? true,
    },
  })

  async function onSubmit(values: ServiceFormData) {
    setIsLoading(true)
    
    try {
      if (initialData?.id) {
        // Update existing service
        const { error } = await supabase
          .from("services")
          .update(values)
          .eq("id", initialData.id)
          
        if (error) throw error
      } else {
        // Create new service
        const { error } = await supabase
          .from("services")
          .insert(values)
          
        if (error) throw error
      }
      
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error saving service:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Service" : "Add New Service"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Service Name *
            </label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter service name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
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
              placeholder="Brief description for service cards"
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
              Full Description *
            </label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Detailed service description"
              rows={4}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="image_url" className="text-sm font-medium">
              Image URL
            </label>
            <Input
              id="image_url"
              {...form.register("image_url")}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price_range" className="text-sm font-medium">
              Price Range
            </label>
            <Input
              id="price_range"
              {...form.register("price_range")}
              placeholder="e.g., $200 - $500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="is_active"
              type="checkbox"
              {...form.register("is_active")}
              className="w-4 h-4"
            />
            <label htmlFor="is_active" className="text-sm font-medium">
              Active Service
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
              {isLoading ? "Saving..." : initialData?.id ? "Update Service" : "Create Service"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 