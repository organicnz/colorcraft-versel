import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Get user data from the users table
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  const isAdmin = userData?.role === "admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">
          Hello {userData?.full_name || session.user.email}! Here&apos;s an overview of your
          account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Email:</span> {session.user.email}
              </div>
              <div>
                <span className="font-medium">Role:</span> {userData?.role || "Customer"}
              </div>
              <div>
                <span className="font-medium">Member since:</span>{" "}
                {new Date(userData?.created_at || session.user.created_at).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {isAdmin && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>Administrative functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Link href="/dashboard/admin" className="block text-blue-600 hover:underline">
                    User Management
                  </Link>
                  <Link href="/portfolio-dash" className="block text-blue-600 hover:underline">
                    Portfolio Management
                  </Link>
                  <Link href="/services-dash" className="block text-blue-600 hover:underline">
                    Services Management
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <Link href="/portfolio-dash/new" className="block text-blue-600 hover:underline">
                    Add New Portfolio Item
                  </Link>
                  <Link href="/services-dash/new" className="block text-blue-600 hover:underline">
                    Add New Service
                  </Link>
                  <Link href="/dashboard/chat" className="block text-blue-600 hover:underline">
                    Chat Management
                  </Link>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {!isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Your Services</CardTitle>
              <CardDescription>Manage your service requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <Link href="/portfolio" className="block text-blue-600 hover:underline">
                  View Portfolio
                </Link>
                <Link href="/services" className="block text-blue-600 hover:underline">
                  Browse Services
                </Link>
                <Link href="/contact" className="block text-blue-600 hover:underline">
                  Contact Us
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Debug info for development */}
      {process.env.NODE_ENV === "development" && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">🔍 Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-yellow-700">
              <div>
                <strong>User ID:</strong> {session.user.id}
              </div>
              <div>
                <strong>Session valid:</strong> {session ? "Yes" : "No"}
              </div>
              <div>
                <strong>User role:</strong> {userData?.role || "None"}
              </div>
              <div>
                <strong>Dashboard loaded:</strong> Successfully
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
