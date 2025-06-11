"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";

// Force dynamic rendering for this debug page
export const dynamic = "force-dynamic";

export default function AdminTestPage() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setError(`User fetch error: ${userError.message}`);
        return;
      }

      setUser(currentUser);

      if (!currentUser) {
        setError("No user logged in");
        return;
      }

      // Check if user is admin
      const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (roleError) {
        setError(`Role fetch error: ${roleError.message}`);
        return;
      }

      setUserData(userData);
      setIsAdmin(userData?.role === "admin");
    } catch (error: any) {
      setError(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-3" />
            <span>Checking admin status...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Status Test</h1>
        <p className="text-muted-foreground">
          This page helps debug admin authentication and editorial button visibility.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            ) : user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Authenticated</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>User ID:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600">
                <XCircle className="h-5 w-5" />
                <span>Not authenticated</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-600 font-medium">Admin Access Granted</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        ADMIN
                      </Badge>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-orange-600" />
                      <span className="text-orange-600">No Admin Access</span>
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        {userData.role?.toUpperCase() || "NO ROLE"}
                      </Badge>
                    </>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Database Role:</strong> {userData.role || "null"}
                  </p>
                  <p>
                    <strong>Full Name:</strong> {userData.full_name || "Not set"}
                  </p>
                  <p>
                    <strong>Profile Created:</strong>{" "}
                    {userData.created_at
                      ? new Date(userData.created_at).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>
              </div>
            ) : user ? (
              <div className="text-orange-600">
                <p>User authenticated but no database profile found.</p>
                <p className="text-sm mt-2">
                  This means the user exists in auth but not in the users table.
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Please sign in to check admin status.</p>
            )}
          </CardContent>
        </Card>

        {/* Expected Behavior */}
        <Card>
          <CardHeader>
            <CardTitle>Expected Editorial Button Behavior</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${isAdmin ? "bg-green-500" : "bg-red-500"}`}
                />
                <span>Portfolio items should {isAdmin ? "show" : "hide"} edit icons</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${isAdmin ? "bg-green-500" : "bg-red-500"}`}
                />
                <span>Floating editorial button should {isAdmin ? "appear" : "be hidden"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${isAdmin ? "bg-green-500" : "bg-red-500"}`}
                />
                <span>Project pages should {isAdmin ? "show" : "hide"} admin controls</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <Button asChild>
                <Link href="/portfolio">View Portfolio (Test Icons)</Link>
              </Button>

              {isAdmin && (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/portfolio-dash">Admin Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/portfolio-dash/new">Add New Project</Link>
                  </Button>
                </>
              )}

              {!user && (
                <Button variant="outline" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              )}

              <Button variant="outline" onClick={checkAuthStatus} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  "Refresh Status"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
