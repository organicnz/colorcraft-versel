"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { serviceSchema, type ServiceFormData } from "@/lib/schemas/service.schema";

export async function createService(formData: ServiceFormData) {
  try {
    // Validate form data
    const validatedFields = serviceSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: "Invalid form data. Please check your entries.",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const serviceData = validatedFields.data;

    // Initialize Supabase client
    const supabase = createClient();

    // Get user session to verify permissions
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { error: "You must be logged in to create services" };
    }

    // Get user data to check role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData) {
      return { error: "Failed to verify user permissions" };
    }

    // Check if user has admin or contributor role
    if (userData.role !== "admin" && userData.role !== "contributor") {
      return { error: "You don&apos;t have permission to create services" };
    }

    // Insert service
    const { data, error } = await supabase.from("services").insert([serviceData]).select().single();

    if (error) {
      console.error("Database error:", error);
      return { error: "Failed to create service" };
    }

    revalidatePath("/services-dash");
    return { success: "Service created successfully", data };
  } catch (error) {
    console.error("Service creation error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function updateService(formData: ServiceFormData) {
  try {
    // Validate form data
    const validatedFields = serviceSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: "Invalid form data. Please check your entries.",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, ...serviceData } = validatedFields.data;

    if (!id) {
      return { error: "Service ID is required for updates" };
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Get user session to verify permissions
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { error: "You must be logged in to update services" };
    }

    // Get user data to check role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData) {
      return { error: "Failed to verify user permissions" };
    }

    // Check if user has admin or contributor role
    if (userData.role !== "admin" && userData.role !== "contributor") {
      return { error: "You don&apos;t have permission to update services" };
    }

    // Update service
    const { data, error } = await supabase
      .from("services")
      .update(serviceData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return { error: "Failed to update service" };
    }

    revalidatePath("/dashboard/services-management");
    revalidatePath(`/dashboard/services-management/${id}`);
    return { success: "Service updated successfully", data };
  } catch (error) {
    console.error("Service update error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function deleteService(id: string) {
  try {
    if (!id) {
      return { error: "Service ID is required" };
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Get user session to verify permissions
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { error: "You must be logged in to delete services" };
    }

    // Get user data to check role
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !userData) {
      return { error: "Failed to verify user permissions" };
    }

    // Check if user has admin role (only admins can delete)
    if (userData.role !== "admin") {
      return { error: "You don&apos;t have permission to delete services" };
    }

    // Delete service
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return { error: "Failed to delete service" };
    }

    revalidatePath("/dashboard/services-management");
    return { success: "Service deleted successfully" };
  } catch (error) {
    console.error("Service deletion error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getServiceById(id: string) {
  try {
    if (!id) {
      return { error: "Service ID is required" };
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Get service
    const { data, error } = await supabase.from("services").select("*").eq("id", id).single();

    if (error) {
      console.error("Database error:", error);
      return { error: "Failed to fetch service" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Service fetch error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getServices() {
  try {
    // Initialize Supabase client
    const supabase = createClient();

    // Get all services
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return { error: "Failed to fetch services" };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Services fetch error:", error);
    return { error: "An unexpected error occurred" };
  }
}
