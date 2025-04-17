"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { createService, updateService } from "@/actions/servicesActions";
import { serviceSchema, type ServiceFormData } from "@/lib/schemas/serviceSchema";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  initialData?: ServiceFormData;
  isEditing?: boolean;
}

export function ServiceForm({ initialData, isEditing = false }: ServiceFormProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      price: 0,
      image_url: "",
    },
  });

  async function onSubmit(data: ServiceFormData) {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        // Convert price to number if it's a string
        price: typeof data.price === "string" ? parseFloat(data.price) : data.price,
      };

      const result = isEditing
        ? await updateService(formData)
        : await createService(formData);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: result.success,
      });

      // Navigate back to services management
      router.push("/dashboard/services-management");
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Service" : "Add New Service"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the information for this service"
            : "Fill out the form below to add a new service to your portfolio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Service title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a clear, descriptive title for this service
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the service in detail" 
                      {...field} 
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a comprehensive description of what this service includes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="0.00" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the price for this service (in USD)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add an image URL that represents this service (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden field for ID when editing */}
            {isEditing && (
              <input type="hidden" {...form.register("id")} />
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/services-management")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 