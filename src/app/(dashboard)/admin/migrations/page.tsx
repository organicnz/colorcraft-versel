"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Database, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Info,
  ArrowRight 
} from "lucide-react";

export default function MigrationsPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [migrationResults, setMigrationResults] = useState<any>(null);

  const runPortfolioStatusMigration = async () => {
    setIsRunning(true);
    setMigrationResults(null);

    try {
      const response = await fetch('/api/migrate-portfolio-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      setMigrationResults(result);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || 'Migration failed');
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Failed to run migration');
      setMigrationResults({
        success: false,
        error: 'Network error occurred'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Database Migrations</h1>
          <p className="text-slate-600">Manage database schema updates and data migrations</p>
        </div>
      </div>

      {/* Portfolio Status Migration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Portfolio Status Field Migration
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Migrate from boolean fields (is_published, is_draft, is_archived) to a single status field
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              Schema Update
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">What this migration does:</p>
                <ul className="text-blue-800 space-y-1">
                  <li>• Adds a new <code className="bg-blue-100 px-1 rounded">status</code> field with values: published, draft, archived</li>
                  <li>• Migrates existing data from boolean fields to the status field</li>
                  <li>• Creates performance indexes for better query speed</li>
                  <li>• Maintains backward compatibility during transition</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={runPortfolioStatusMigration}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Running Migration...' : 'Run Portfolio Status Migration'}
            </Button>
            
            {migrationResults && (
              <div className="flex items-center gap-2">
                {migrationResults.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  migrationResults.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {migrationResults.success ? 'Migration Completed' : 'Migration Failed'}
                </span>
              </div>
            )}
          </div>

          {/* Migration Results */}
          {migrationResults && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">Migration Results:</h4>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                {JSON.stringify(migrationResults, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Future Migrations Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Migrations</CardTitle>
          <p className="text-sm text-slate-600">
            Other database migrations that can be run
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-500">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No additional migrations available at this time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 