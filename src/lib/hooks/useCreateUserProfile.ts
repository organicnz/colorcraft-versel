import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * Creates a user profile in the users table
 * This is a helper function to ensure user profiles are properly created
 * after Supabase Auth user creation
 */
export async function createUserProfile(
  userId: string,
  fullName: string,
  email: string,
  role: "customer" | "admin" = "customer"
): Promise<{ success: boolean; error: PostgrestError | null }> {
  try {
    if (!userId) {
      console.error("Cannot create user profile: Missing user ID");
      return {
        success: false,
        error: {
          message: "Missing user ID",
          details: "",
          hint: "",
          code: "USER_ID_REQUIRED",
        } as PostgrestError,
      };
    }

    const supabase = createClient();

    // First check if the user already exists in the users table
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (existingUser) {
      console.warn(`User profile already exists for user ${userId}`);
      return { success: true, error: null };
    }

    // Create the user profile in the database
    const { error } = await supabase.from("users").insert({
      id: userId,
      full_name: fullName,
      email,
      role,
    });

    if (error) {
      console.error("Error creating user profile:", error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error creating user profile:", error);
    return {
      success: false,
      error: {
        message: "Unexpected error creating user profile",
        details: error instanceof Error ? error.message : String(error),
        hint: "Please try again or contact support",
        code: "UNEXPECTED_ERROR",
      } as PostgrestError,
    };
  }
}
