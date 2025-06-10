import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SidebarNav, sidebarNavItems } from "./_components/sidebar-nav";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let connectionError = null;
  const supabase = await createClient();
  
  // Get current session (middleware already checks auth, but we need user info)
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Get user role for admin check
  let userData = null;
  let isAdmin = false;
  
  try {
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();
    
    if (error) {
      connectionError = error.message;
    } else {
      userData = data;
      isAdmin = userData?.role === "admin";
    }
  } catch (error: any) {
    connectionError = error.message;
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      {connectionError && connectionError.includes("Invalid API key") && (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Supabase Connection Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>There was an issue connecting to the database: {connectionError}</p>
            <div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/debug">Check Connection</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pl-2 pr-4">
            <SidebarNav items={sidebarNavItems} isAdmin={isAdmin} className="px-2" />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
} 