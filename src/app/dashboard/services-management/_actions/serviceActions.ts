"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Service schema for validation
export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  is_featured: z.boolean().default(false),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

// Create a new service
export async function createService(formData: ServiceFormValues) {
  try {
    const supabase = await createClient();
    
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("You must be logged in to create a service");
    }
    
    // Verify user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();
      
    if (userError || !userData || userData.role !== "admin") {
      throw new Error("You do not have permission to create services");
    }
    
    // Insert the new service
    const { data, error } = await supabase
      .from("services")
      .insert({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        is_featured: formData.is_featured,
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    revalidatePath("/dashboard/services-management");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create service" };
  }
}

// Update an existing service
export async function updateService(id: string, formData: ServiceFormValues) {
  try {
    const supabase = createClient();
    
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("You must be logged in to update a service");
    }
    
    // Verify user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();
      
    if (userError || !userData || userData.role !== "admin") {
      throw new Error("You do not have permission to update services");
    }
    
    // Update the service
    const { data, error } = await supabase
      .from("services")
      .update({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        is_featured: formData.is_featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    revalidatePath("/dashboard/services-management");
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update service" };
  }
}

// Delete a service
export async function deleteService(id: string) {
  try {
    const supabase = createClient();
    
    // Verify user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("You must be logged in to delete a service");
    }
    
    // Verify user is admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();
      
    if (userError || !userData || userData.role !== "admin") {
      throw new Error("You do not have permission to delete services");
    }
    
    // Delete the service
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", id);
    
    if (error) {
      throw new Error(error.message);
    }
    
    revalidatePath("/dashboard/services-management");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete service" };
  }
} 