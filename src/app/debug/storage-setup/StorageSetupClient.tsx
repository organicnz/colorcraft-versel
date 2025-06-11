"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle, Loader2, Copy } from "lucide-react";

interface ApiResponse {
  success?: boolean;
  message?: string;
  note?: string;
  sqlToRun?: string;
  error?: string;
  details?: string;
  directoryResults?: Array<{
    id: string;
    before?: { success: boolean; error: string };
    after?: { success: boolean; error: string };
    success: boolean;
    error?: string; // For backward compatibility
  }>;
  portfolioItemsProcessed?: number;
  bucketStatus?: string;
  policyResults?: Array<{
    name: string;
    success: boolean;
    error?: string | null;
  }>;
  directoryStructure?: string;
}

export default function StorageSetupClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    storageSetup?: ApiResponse;
  }>({});

  const handleStorageSetup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/apply-storage-policies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setResults((prev) => ({ ...prev, storageSetup: data }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        storageSetup: {
          error: "Network error",
          details: String(error),
        },
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const renderResult = (result: ApiResponse | undefined, title: string) => {
    if (!result) return null;

    const isSuccess = result.success;
    const isError = result.error;

    return (
      <div className="space-y-4">
        <Alert className={isSuccess ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <div className="flex items-center gap-2">
            {isSuccess ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <span className="font-medium">{title}</span>
          </div>
          <AlertDescription className="mt-2">
            {isSuccess ? (
              <div>
                <p className="text-green-700">{result.message}</p>
                {result.note && (
                  <p className="text-sm text-green-600 mt-1 bg-green-100 p-2 rounded">
                    {result.note}
                  </p>
                )}
                {result.portfolioItemsProcessed !== undefined && (
                  <p className="text-sm text-green-600 mt-1">
                    Processed {result.portfolioItemsProcessed} portfolio items
                  </p>
                )}
                {result.bucketStatus && (
                  <p className="text-sm text-green-600 mt-1">
                    Bucket status: {result.bucketStatus}
                  </p>
                )}
                {result.directoryStructure && (
                  <p className="text-sm text-green-600 mt-1">
                    Directory structure: {result.directoryStructure}
                  </p>
                )}
                {result.policyResults && result.policyResults.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-700">Policy Creation Results:</p>
                    <ul className="text-xs text-green-600 mt-1 space-y-1">
                      {result.policyResults.map((policy, index) => (
                        <li key={index} className="flex items-center gap-1">
                          {policy.success ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-500" />
                          )}
                          <span>
                            {policy.name}: {policy.success ? "Success" : `Failed - ${policy.error}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.directoryResults && result.directoryResults.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-700">
                      Directory Creation Results:
                    </p>
                    <ul className="text-xs text-green-600 mt-1 space-y-2">
                      {result.directoryResults.map((dir, index) => (
                        <li key={index} className="border border-green-200 rounded p-2 bg-green-50">
                          <div className="flex items-center gap-1 font-medium">
                            {dir.success ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>Portfolio {dir.id}</span>
                          </div>
                          {dir.before && dir.after ? (
                            // New before/after structure
                            <div className="ml-4 mt-1 space-y-1">
                              <div className="flex items-center gap-1 text-xs">
                                {dir.before.success ? (
                                  <CheckCircle className="h-2 w-2" />
                                ) : (
                                  <XCircle className="h-2 w-2 text-red-500" />
                                )}
                                <span>
                                  before_images/:{" "}
                                  {dir.before.success ? "Success" : `Failed - ${dir.before.error}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                {dir.after.success ? (
                                  <CheckCircle className="h-2 w-2" />
                                ) : (
                                  <XCircle className="h-2 w-2 text-red-500" />
                                )}
                                <span>
                                  after_images/:{" "}
                                  {dir.after.success ? "Success" : `Failed - ${dir.after.error}`}
                                </span>
                              </div>
                            </div>
                          ) : (
                            // Backward compatibility for old structure
                            <div className="ml-4 mt-1 text-xs">
                              {dir.success ? "Success" : `Failed - ${dir.error}`}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-red-700">{result.error}</p>
                {result.details && <p className="text-sm text-red-600 mt-1">{result.details}</p>}
              </div>
            )}
          </AlertDescription>
        </Alert>

        {/* Show SQL to run manually if provided */}
        {result.sqlToRun && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                Manual SQL Required
              </CardTitle>
              <CardDescription>
                Copy this SQL and run it in your Supabase Dashboard → SQL Editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-slate-100 p-4 rounded text-xs overflow-auto max-h-64">
                  {result.sqlToRun}
                </pre>
                <Button
                  onClick={() => copyToClipboard(result.sqlToRun!)}
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Storage Setup</h1>
        <p className="text-muted-foreground">
          Set up Supabase storage bucket and policies for portfolio images with
          before_images/after_images organization
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Storage Configuration</CardTitle>
          <CardDescription>
            This will create the portfolio storage bucket with before_images/after_images
            directories and set up the necessary RLS policies for admin image uploads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <h4 className="font-medium text-blue-800 mb-2">Directory Structure</h4>
            <div className="text-sm text-blue-700 font-mono">
              <div>portfolio/</div>
              <div className="ml-2">├── {"{portfolio-uuid}/"}</div>
              <div className="ml-4">├── before_images/</div>
              <div className="ml-6">└── before-image-1.jpg</div>
              <div className="ml-4">└── after_images/</div>
              <div className="ml-6">└── after-image-1.jpg</div>
            </div>
          </div>

          <Button onClick={handleStorageSetup} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up Storage with Before/After Images Directories...
              </>
            ) : (
              "Setup Storage with Before/After Images Structure"
            )}
          </Button>

          {renderResult(results.storageSetup, "Storage Setup")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Setup Instructions</CardTitle>
          <CardDescription>
            Complete setup by running the provided SQL in your Supabase Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p>
                  <strong>Complete Setup Steps:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Click "Setup Storage with Before/After Images Structure" above</li>
                  <li>Copy the provided SQL code if manual setup is needed</li>
                  <li>Go to your Supabase Dashboard</li>
                  <li>
                    Navigate to <strong>SQL Editor</strong>
                  </li>
                  <li>Paste and run the SQL script</li>
                  <li>
                    Verify the policies are created in <strong>Storage &gt; Policies</strong>
                  </li>
                  <li>
                    Check the directory structure in <strong>Storage &gt; portfolio bucket</strong>
                  </li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
