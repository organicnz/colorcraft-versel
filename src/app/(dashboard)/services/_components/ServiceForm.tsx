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
import { toast } from '@/components/ui/use-toast';

// Define form validation schema
const formSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Service name is required"),
  short_description: z.string().min(1, "Short description is required"),
  description: z.string().min(1, "Full description is required"),
  price_range: z.string().optional(),
  image_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  service?: any; // Use a proper Service type in a real application
}

export default function ServiceForm({ service }: ServiceFormProps = {}) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const isEditing = !!service?.id;

  // Define form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: service?.id || undefined,
      name: service?.name || "",
      short_description: service?.short_description || "",
      description: service?.description || "",
      price_range: service?.price_range || "",
      image_url: service?.image_url || "",
      is_active: service?.is_active ?? true,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);

    try {
      // TODO: Implement service creation/updating server actions
      // For now, we'll just simulate a successful submission
      
      console.log("Service data to submit:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = true; // Simulate success
      
      if (success) {
        toast({
          title: "Success",
          description: isEditing ? "Service updated successfully!" : "Service created successfully!",
        });
        router.push("/dashboard/services");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: "Failed to save service. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Service ID - Hidden field for editing */}
        {isEditing && (
          <input type="hidden" name="id" value={service.id} />
        )}

        {/* Basic Service Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Service Information</h2>
          <Separator />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Furniture Restoration" {...field} />
                </FormControl>
                <FormDescription>The name of your service offering</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="A brief one-line description" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>A short summary that appears in service lists</FormDescription>
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
                    placeholder="A detailed description of the service, what's included, and what clients can expect." 
                    rows={5}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Detailed information about the service</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Service Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Service Details</h2>
          <Separator />

          <FormField
            control={form.control}
            name="price_range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Range</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="$100-$500 depending on size" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>Optional price range or starting price information</FormDescription>
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
                  <Input 
                    placeholder="https://example.com/service-image.jpg" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>URL for an image representing this service</FormDescription>
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
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>
                    Inactive services won't be shown on your website
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
            onClick={() => router.push("/dashboard/services")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Service" : "Add Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 