"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export function EnvChecker() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkEnv = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/fix-supabase");
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to check environment variables");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only auto-check in development
    if (process.env.NODE_ENV === "development") {
      checkEnv();
    }
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Supabase Connection Checker</CardTitle>
        <CardDescription>
          Debug your Supabase connection and environment variables
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {results && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Environment Variables</h3>
              <div className="bg-muted p-4 rounded-md overflow-x-auto">
                <pre className="text-xs">{JSON.stringify(results.envInfo, null, 2)}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Anon Key Test</h3>
              {results.anonKeyTest ? (
                <div className="flex items-start gap-2">
                  {results.anonKeyTest.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    {results.anonKeyTest.success ? (
                      <p className="font-medium text-green-600">Success</p>
                    ) : (
                      <p className="font-medium text-red-600">Failed</p>
                    )}
                    {results.anonKeyTest.error && (
                      <div className="bg-muted p-3 rounded-md mt-2 overflow-x-auto">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(results.anonKeyTest.error, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Not tested (missing variables)</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Service Role Key Test</h3>
              {results.serviceRoleTest ? (
                <div className="flex items-start gap-2">
                  {results.serviceRoleTest.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    {results.serviceRoleTest.success ? (
                      <p className="font-medium text-green-600">Success</p>
                    ) : (
                      <p className="font-medium text-red-600">Failed</p>
                    )}
                    {results.serviceRoleTest.error && (
                      <div className="bg-muted p-3 rounded-md mt-2 overflow-x-auto">
                        <pre className="text-xs whitespace-pre-wrap">
                          {JSON.stringify(results.serviceRoleTest.error, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Not tested (missing variables)</p>
              )}
            </div>

            <div className="p-4 border rounded-md bg-amber-50 dark:bg-amber-950">
              <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">How to fix</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-amber-700 dark:text-amber-400">
                <li>Check that your <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> is set in <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">.env.local</code></li>
                <li>Make sure you're using the <strong>anon key</strong> from Supabase, not the service role key</li>
                <li>Verify your Supabase project is active and not paused</li>
                <li>Check if your API keys need to be rotated in the Supabase dashboard</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={checkEnv} disabled={loading}>
          {loading ? "Checking..." : "Check Again"}
        </Button>
      </CardFooter>
    </Card>
  );
} 