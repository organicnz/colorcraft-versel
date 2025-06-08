"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Upload, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';

interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: string;
  [key: string]: any;
}

export default function StorageSetupPage() {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, ApiResponse>>({});

  const runApiCall = async (endpoint: string, label: string) => {
    setIsLoading(prev => ({ ...prev, [label]: true }));
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      setResults(prev => ({ ...prev, [label]: data }));
      
      if (data.success) {
        toast.success(`${label} completed successfully`);
      } else {
        toast.error(`${label} failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      const errorData = {
        success: false,
        message: `${label} failed`,
        error: error.message
      };
      
      setResults(prev => ({ ...prev, [label]: errorData }));
      toast.error(`${label} failed: ${error.message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [label]: false }));
    }
  };

  const steps = [
    {
      id: 'storage-setup',
      label: 'Setup Storage Bucket & Policies',
      description: 'Creates the portfolio storage bucket and sets up proper RLS policies for admin access',
      endpoint: '/api/setup-portfolio-storage',
      icon: Upload
    },
    {
      id: 'create-directories',
      label: 'Create Portfolio Directories',
      description: 'Creates directories for all existing portfolio items that don\'t have them',
      endpoint: '/api/create-portfolio-directories',
      icon: FolderPlus
    }
  ];

  const runAllSteps = async () => {
    for (const step of steps) {
      if (!isLoading[step.label]) {
        await runApiCall(step.endpoint, step.label);
        // Small delay between steps
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const getStatusIcon = (label: string) => {
    if (isLoading[label]) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    const result = results[label];
    if (!result) {
      return null;
    }
    
    return result.success 
      ? <CheckCircle2 className="h-4 w-4 text-green-500" />
      : <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (label: string) => {
    if (isLoading[label]) {
      return <Badge variant="secondary">Running...</Badge>;
    }
    
    const result = results[label];
    if (!result) {
      return <Badge variant="outline">Pending</Badge>;
    }
    
    return result.success 
      ? <Badge variant="default" className="bg-green-500">Success</Badge>
      : <Badge variant="destructive">Failed</Badge>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Storage Setup & Debug</h1>
        <p className="text-gray-600">
          Fix Supabase storage RLS issues and setup portfolio image directories
        </p>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-yellow-700">
          <p>• This page fixes the "row-level security policy" errors when uploading images</p>
          <p>• Run these steps in order to resolve storage permission issues</p>
          <p>• You must be logged in as an admin to use these functions</p>
          <p>• These operations are safe to run multiple times</p>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6">
        <Button 
          onClick={runAllSteps}
          disabled={Object.values(isLoading).some(Boolean)}
          className="flex-1"
        >
          {Object.values(isLoading).some(Boolean) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Steps...
            </>
          ) : (
            'Run All Steps'
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">{step.label}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(step.label)}
                    {getStatusBadge(step.label)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button
                  onClick={() => runApiCall(step.endpoint, step.label)}
                  disabled={isLoading[step.label]}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading[step.label] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    `Run ${step.label}`
                  )}
                </Button>

                {results[step.label] && (
                  <Card className={`${results[step.label].success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <p className="font-medium">{results[step.label].message}</p>
                        
                        {results[step.label].error && (
                          <p className="text-red-600 text-sm">
                            Error: {results[step.label].error}
                          </p>
                        )}
                        
                        {results[step.label].details && (
                          <p className="text-gray-600 text-sm">
                            Details: {results[step.label].details}
                          </p>
                        )}
                        
                        {/* Show additional result data if available */}
                        {Object.keys(results[step.label]).length > 3 && (
                          <details className="mt-2">
                            <summary className="text-sm text-gray-500 cursor-pointer">
                              Show detailed results
                            </summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                              {JSON.stringify(results[step.label], null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">What This Fixes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-blue-700">
          <p>✅ <strong>RLS Policy Violation:</strong> Sets up proper storage policies for admin image uploads</p>
          <p>✅ <strong>Directory Structure:</strong> Creates organized folders for each portfolio item</p>
          <p>✅ <strong>Public Access:</strong> Ensures uploaded images are publicly viewable</p>
          <p>✅ <strong>File Management:</strong> Enables proper image deletion and organization</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>1. Run both setup steps above</p>
          <p>2. Go to your portfolio management page</p>
          <p>3. Try uploading images to a portfolio item</p>
          <p>4. If you still get errors, check the browser console for details</p>
        </CardContent>
      </Card>
    </div>
  );
} 