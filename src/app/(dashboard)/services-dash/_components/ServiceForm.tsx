"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createService, updateService, serviceSchema } from "@/actions/servicesActions";
import { z } from "zod";

type ServiceFormProps = {
  service?: z.infer<typeof serviceSchema>;
};

export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!service?.id;
  
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {
      title: "",
      description: "",
      price: 0,
      image_url: ""
    }
  });
  
  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    try {
      setIsSubmitting(true);
      
      if (isEditing) {
        // Update existing service
        const { error } = await updateService({
          ...values,
          id: service.id
        });
        
        if (error) {
          throw new Error(error);
        }
        
        toast.success("Service updated successfully");
      } else {
        // Create new service
        const { error } = await createService(values);
        
        if (error) {
          throw new Error(error);
        }
        
        toast.success("Service created successfully");
      }
      
      router.push("/services-dash");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter service title" {...field} />
              </FormControl>
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
                  placeholder="Describe this service"
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
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
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push("/services-dash")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 