import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ThemePreference from "@/components/account/ThemePreference";
import { User, Settings, Shield, Mail, Calendar, Palette } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Account Settings",
  description: "Manage your account preferences and settings",
};

async function UserProfile() {
  const supabase = await createClient();

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("users")
    .select("id, email, full_name, avatar_url, role, created_at")
    .eq("id", session.user.id)
    .single();

  const userData = profile || {
    id: session.user.id,
    email: session.user.email || "",
    full_name: session.user.user_metadata?.full_name,
    avatar_url: session.user.user_metadata?.avatar_url,
    role: "customer",
    created_at: session.user.created_at,
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const isAdmin = userData.role === "admin";
  const isContributor = userData.role === "contributor";

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>Your account details and role information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-gray-200">
              <AvatarImage
                src={userData.avatar_url}
                alt={userData.full_name || userData.email}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-accent-500 text-white text-lg font-semibold">
                {getInitials(userData.full_name, userData.email)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {userData.full_name || "User"}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {(isAdmin || isContributor) && (
                  <Badge variant="outline" className="gap-1">
                    {isAdmin ? (
                      <>
                        <Shield className="w-3 h-3" />
                        Administrator
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3" />
                        Contributor
                      </>
                    )}
                  </Badge>
                )}

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Member since {new Date(userData.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Preferences */}
      <ThemePreference />

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Actions
          </CardTitle>
          <CardDescription>Manage your account and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Change Email
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Reset Password
            </Button>
          </div>

          <Separator />

          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>Need help?</strong> Contact our support team or check out our help
              documentation.
            </p>
            <div className="flex gap-3">
              <Button variant="link" size="sm" className="p-0 h-auto">
                Contact Support
              </Button>
              <Button variant="link" size="sm" className="p-0 h-auto">
                Help Center
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function AccountSettingsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account preferences, theme settings, and profile information.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        }
      >
        <UserProfile />
      </Suspense>
    </div>
  );
}
