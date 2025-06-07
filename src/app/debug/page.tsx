import { EnvChecker } from "@/components/dev/EnvChecker";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const metadata = {
  title: "Debug - Supabase Connection",
  description: "Debug your Supabase connection and environment variables",
};

export default function DebugPage() {
  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">Supabase Connection Debugger</h1>
        <p className="text-muted-foreground mb-6">
          This page helps you diagnose issues with your Supabase connection.
        </p>
        
        <Alert variant="destructive" className="mb-6">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Production Warning</AlertTitle>
          <AlertDescription>
            This page should be disabled or protected in production environments.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Common Issues</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Missing or invalid <code className="bg-muted px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in environment variables</li>
              <li>Using service role key instead of anon key for public operations</li>
              <li>Supabase project is paused due to billing or inactivity</li>
              <li>API key has been revoked or is incorrect</li>
              <li>Environment variables not being loaded properly</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Required Environment Variables</h2>
            <div className="bg-muted p-4 rounded-md font-mono text-sm">
              <p># Supabase Connection</p>
              <p>NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...your-anon-key</p>
              <p>SUPABASE_SERVICE_ROLE_KEY=eyJh...your-service-role-key</p>
            </div>
          </div>
        </div>
      </div>
      
      <EnvChecker />
    </div>
  );
} 