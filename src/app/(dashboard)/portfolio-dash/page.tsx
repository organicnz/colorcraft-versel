import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PortfolioTable from "./_components/PortfolioTable";
import {
  PlusCircle,
  FolderOpen,
  Star,
  Eye,
  TrendingUp,
  Calendar,
  Image as ImageIcon,
  Palette,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PortfolioDashboardPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the portfolio dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Sign In to Continue</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: userResponse } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (!userResponse || userResponse.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: projects, error } = await supabase
    .from("portfolio")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Error Loading Projects</CardTitle>
            <CardDescription>
              Unable to fetch portfolio projects. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalProjects = projects?.length || 0;
  const featuredProjects = projects?.filter((p) => p.is_featured)?.length || 0;
  const recentProjects =
    projects?.filter((p) => {
      const createdDate = new Date(p.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    })?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Portfolio Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage and showcase your creative projects
                </p>
              </div>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-[#3ECF8E] hover:bg-[#38BC81] shadow-lg text-white border border-[#3ECF8E]/30 transition-all duration-300 hover:shadow-xl"
          >
            <Link href="/portfolio-dash/new" className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5" />
              Add New Project
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            glass={true}
            glassVariant="light"
            glassIntensity="medium"
            className="border-blue-200/50 dark:border-blue-800/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Projects
              </CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {totalProjects}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">All portfolio projects</p>
            </CardContent>
          </Card>

          <Card
            glass={true}
            glassVariant="light"
            glassIntensity="medium"
            className="border-yellow-200/50 dark:border-yellow-800/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Featured Projects
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100">
                {featuredProjects}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Highlighted on homepage
              </p>
            </CardContent>
          </Card>

          <Card
            glass={true}
            glassVariant="light"
            glassIntensity="medium"
            className="border-purple-200/50 dark:border-purple-800/50"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Recent Projects
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                {recentProjects}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Added this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle className="text-xl">Project Management</CardTitle>
                  <CardDescription>
                    View, edit, and manage all your portfolio projects
                  </CardDescription>
                </div>
              </div>
              {totalProjects > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                >
                  {totalProjects} {totalProjects === 1 ? "Project" : "Projects"}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {projects?.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mb-6">
                  <ImageIcon className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start building your portfolio by adding your first project. Showcase your best
                  work and attract new clients.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-[#3ECF8E] hover:bg-[#38BC81] text-white border border-[#3ECF8E]/30 transition-all duration-300 hover:shadow-xl"
                >
                  <Link href="/portfolio-dash/new" className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5" />
                    Add Your First Project
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {projects.length} project{projects.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last updated: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <PortfolioTable projects={projects || []} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
