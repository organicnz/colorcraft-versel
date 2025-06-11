"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Database,
  Users,
  Play,
  ExternalLink,
} from "lucide-react";

export default function TeamSetupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runMigration = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/create-team-table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to run migration");
        setResult(data);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Team Table Setup</h1>
          <p className="text-muted-foreground">
            Initialize the team database table and sample data for your website's team section.
          </p>
        </div>

        {/* Migration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Create Team Table
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">What this migration does:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>
                  • Creates the <code className="bg-muted px-1 rounded">team</code> table with all
                  necessary fields
                </li>
                <li>• Sets up Row Level Security (RLS) policies</li>
                <li>• Creates performance indexes</li>
                <li>• Inserts sample team member data</li>
                <li>• Configures proper permissions</li>
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={runMigration}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running Migration...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Migration
                  </>
                )}
              </Button>

              {result?.success && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Migration Complete
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Result Card */}
        {(result || error) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result?.success ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Migration Successful
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Migration Error
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result?.success ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 font-medium">{result.message}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Next Steps:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Visit the{" "}
                        <a href="/dashboard/team" className="text-blue-600 hover:underline">
                          Team Management Dashboard
                        </a>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Check your{" "}
                        <a href="/" className="text-blue-600 hover:underline">
                          Homepage
                        </a>{" "}
                        for the team section
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        Add, edit, or manage team members
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 font-medium">{error || result?.error}</p>
                    {result?.details && (
                      <p className="text-red-700 text-sm mt-1">{result.details}</p>
                    )}
                  </div>

                  {result?.suggestion && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <h4 className="font-semibold text-blue-800 mb-2">Manual Migration:</h4>
                      <p className="text-blue-700 text-sm mb-2">{result.suggestion}</p>
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700">
                          1. Go to your{" "}
                          <a
                            href="https://app.supabase.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:no-underline inline-flex items-center gap-1"
                          >
                            Supabase Dashboard
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </p>
                        <p className="text-sm text-blue-700">2. Open the SQL Editor</p>
                        <p className="text-sm text-blue-700">
                          3. Copy and run the migration from{" "}
                          <code>sql/migrations/create_team_table.sql</code>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Debug Info */}
              {result && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    View Debug Information
                  </summary>
                  <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              About the Team System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The team management system allows you to showcase your team members on the homepage
              and manage them through the admin dashboard.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Features Included:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Team member profiles with photos</li>
                  <li>• Social media links</li>
                  <li>• Skills and specialties</li>
                  <li>• Years of experience tracking</li>
                  <li>• Featured team member highlights</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Admin Features:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Add/edit/delete team members</li>
                  <li>• Feature/unfeature members</li>
                  <li>• Reorder team display</li>
                  <li>• Activate/deactivate profiles</li>
                  <li>• Bulk management tools</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
