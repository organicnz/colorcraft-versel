"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Database, User, FileImage, Zap, Code2 } from "lucide-react";

export default function SupabaseTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LIMIT 5;"
  );
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check current user on mount
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const addResult = (
    name: string,
    success: boolean,
    data: unknown = null,
    error: string | null = null
  ) => {
    setResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        success,
        data,
        error,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const clearResults = () => setResults([]);

  // Test functions
  const testServerEndpoint = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/supabase-demo");
      const data = await response.json();
      addResult("Server API Demo", response.ok, data, response.ok ? null : data.error);
    } catch (error: any) {
      addResult("Server API Demo", false, null, error.message);
    }
    setLoading(false);
  };

  const testClientAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      addResult(
        "Client Auth Check",
        !error,
        {
          hasSession: !!data.session,
          userId: data.session?.user?.id || null,
          email: data.session?.user?.email || null,
        },
        error?.message || null
      );
    } catch (error: any) {
      addResult("Client Auth Check", false, null, error.message);
    }
  };

  const testDatabaseQueries = async () => {
    const tests = [
      {
        name: "Query Users Table",
        query: async () => supabase.from("users").select("id, email, role").limit(3),
      },
      {
        name: "Query Portfolio Table",
        query: async () => supabase.from("portfolio").select("id, title, is_featured").limit(3),
      },
      {
        name: "Query Services Table",
        query: async () => supabase.from("services").select("id, name").limit(3),
      },
    ];

    for (const test of tests) {
      try {
        const { data, error } = await test.query();
        addResult(test.name, !error, data, error?.message || null);
      } catch (error: any) {
        addResult(test.name, false, null, error.message);
      }
    }
  };

  const testRealtimeConnection = async () => {
    try {
      const channel = supabase.channel("test-channel");

      channel
        .on("broadcast", { event: "test" }, (payload) => {
          addResult("Realtime Broadcast Received", true, payload, null);
        })
        .subscribe((status) => {
          addResult(
            "Realtime Connection",
            status === "SUBSCRIBED",
            { status },
            status !== "SUBSCRIBED" ? "Failed to subscribe" : null
          );
        });

      // Send a test broadcast
      setTimeout(() => {
        channel.send({
          type: "broadcast",
          event: "test",
          payload: { message: "Hello from programmatic access!", timestamp: Date.now() },
        });
      }, 1000);

      // Clean up after 5 seconds
      setTimeout(() => {
        supabase.removeChannel(channel);
      }, 5000);
    } catch (error: any) {
      addResult("Realtime Test", false, null, error.message);
    }
  };

  const testStorage = async () => {
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      addResult("Storage - List Buckets", !bucketsError, buckets, bucketsError?.message || null);

      if (!bucketsError && buckets.length > 0) {
        const { data: files, error: filesError } = await supabase.storage
          .from(buckets[0].name)
          .list("", { limit: 5 });

        addResult("Storage - List Files", !filesError, files, filesError?.message || null);
      }
    } catch (error: any) {
      addResult("Storage Test", false, null, error.message);
    }
  };

  const executeCustomQuery = async () => {
    if (!customQuery.trim()) return;

    try {
      // For custom queries, we need to use RPC or direct table access
      // This example assumes the query is for a specific table
      if (
        customQuery.toLowerCase().includes("select") &&
        customQuery.toLowerCase().includes("from")
      ) {
        // Extract table name (simple approach)
        const match = customQuery.match(/from\s+(\w+)/i);
        if (match) {
          const tableName = match[1];
          const { data, error } = await supabase.from(tableName).select("*").limit(5);
          addResult("Custom Query", !error, data, error?.message || null);
        } else {
          addResult("Custom Query", false, null, "Could not parse table name from query");
        }
      } else {
        addResult("Custom Query", false, null, "Only SELECT queries are supported in this demo");
      }
    } catch (error: any) {
      addResult("Custom Query", false, null, error.message);
    }
  };

  const createSamplePortfolio = async () => {
    if (!user) {
      toast.error("Please sign in to create portfolio items");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("portfolio")
        .insert([
          {
            title: `Test Project ${Date.now()}`,
            brief_description: "Created via programmatic access",
            description: "This portfolio item was created using the Supabase JavaScript client.",
            before_images: ["https://via.placeholder.com/400x300?text=Before"],
            after_images: ["https://via.placeholder.com/400x300?text=After"],
            materials: ["Test Material 1", "Test Material 2"],
            techniques: ["Programmatic Creation"],
            is_featured: false,
          },
        ])
        .select()
        .single();

      addResult("Create Portfolio Item", !error, data, error?.message || null);

      if (!error) {
        toast.success("Portfolio item created successfully!");
      }
    } catch (error: any) {
      addResult("Create Portfolio Item", false, null, error.message);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Supabase Programmatic Access Demo</h1>
        <p className="text-muted-foreground">
          This page demonstrates various ways to access Supabase programmatically using
          JavaScript/TypeScript.
        </p>

        {user ? (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✅ Signed in as: {user.email} (ID: {user.id.substring(0, 8)}...)
            </p>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">⚠️ Not signed in. Some operations may be limited.</p>
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Server-side API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testServerEndpoint} disabled={loading} className="w-full">
              Test Server Demo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testClientAuth} disabled={loading} className="w-full">
              Check Auth Status
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testDatabaseQueries} disabled={loading} className="w-full">
              Test DB Queries
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Real-time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testRealtimeConnection} disabled={loading} className="w-full">
              Test Real-time
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileImage className="h-4 w-4" />
              Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testStorage} disabled={loading} className="w-full">
              Test Storage
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Create Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={createSamplePortfolio} disabled={loading || !user} className="w-full">
              Create Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Custom Query */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Custom Query</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="Enter a SELECT query..."
            rows={3}
          />
          <Button onClick={executeCustomQuery} disabled={loading}>
            Execute Query
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Test Results</h2>
          <Button onClick={clearResults} variant="outline">
            Clear Results
          </Button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Running tests...
          </div>
        )}

        {results.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              No test results yet. Click any test button above to get started.
            </CardContent>
          </Card>
        )}

        {results.map((result) => (
          <Card key={result.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  {result.name}
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? "✅ Success" : "❌ Failed"}
                  </Badge>
                </CardTitle>
                <span className="text-sm text-muted-foreground">{result.timestamp}</span>
              </div>
            </CardHeader>
            <CardContent>
              {result.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
              {result.data && (
                <div className="bg-slate-50 p-3 rounded">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
