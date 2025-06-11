import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

// Force dynamic rendering for authentication checks
export const dynamic = "force-dynamic";

export default async function DebugLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  try {
    // Check if user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/signin?message=Please sign in to access debug tools");
    }

    // Check if user is an admin
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    if (userError || !userData || userData.role !== "admin") {
      redirect("/dashboard?message=Admin access required for debug tools");
    }

    return (
      <div className="container py-8">
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Admin Debug Area</AlertTitle>
          <AlertDescription className="text-blue-700">
            Welcome {userData.full_name || user.email}. You have admin access to debug tools. These
            pages are protected and only visible to admin users.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  } catch (error) {
    console.error("Error in debug layout:", error);
    redirect("/auth/signin?message=Authentication error");
  }
}
