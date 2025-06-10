import React from 'react';
import { createClient } from '@/lib/supabase/server';

export default async function SupabaseTestPage() {
  const supabase = await createClient();
  
  const testResults = {
    connection: 'Not tested',
    projects: 'Not tested',
    portfolio: 'Not tested',
    publicSchema: 'Not tested',
    allTables: 'Not tested'
  };

  try {
    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);
    
    if (healthError) {
      testResults.connection = `Error: ${healthError.message}`;
    } else {
      testResults.connection = 'Success';
    }

    // Test projects table
    try {
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('count')
        .limit(1);
      
      if (projectsError) {
        testResults.projects = `Error: ${projectsError.message}`;
      } else {
        testResults.projects = `Success - Found ${projectsData?.length || 0} rows`;
      }
    } catch (err: any) {
      testResults.projects = `Error: ${err.message}`;
    }

    // Test portfolio table
    try {
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio')
        .select('count')
        .limit(1);
      
      if (portfolioError) {
        testResults.portfolio = `Error: ${portfolioError.message}`;
      } else {
        testResults.portfolio = `Success - Found ${portfolioData?.length || 0} rows`;
      }
    } catch (err: any) {
      testResults.portfolio = `Error: ${err.message}`;
    }

    // List all tables in public schema
    try {
      const { data: tablesData, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        testResults.allTables = `Error: ${tablesError.message}`;
      } else {
        testResults.allTables = `Found tables: ${tablesData?.map(t => t.table_name).join(', ') || 'None'}`;
      }
    } catch (err: any) {
      testResults.allTables = `Error: ${err.message}`;
    }

  } catch (err: any) {
    testResults.connection = `Fatal Error: ${err.message}`;
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Supabase Connection Test</h1>
      
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Connection Test Results</h2>
          
          <div className="space-y-4">
            <div>
              <strong>Basic Connection:</strong>
              <span className={`ml-2 p-2 rounded ${testResults.connection.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {testResults.connection}
              </span>
            </div>
            
            <div>
              <strong>'projects' table:</strong>
              <span className={`ml-2 p-2 rounded ${testResults.projects.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {testResults.projects}
              </span>
            </div>
            
            <div>
              <strong>'portfolio' table:</strong>
              <span className={`ml-2 p-2 rounded ${testResults.portfolio.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {testResults.portfolio}
              </span>
            </div>
            
            <div>
              <strong>All Tables:</strong>
              <span className={`ml-2 p-2 rounded ${testResults.allTables.includes('Found') ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                {testResults.allTables}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</div>
            <div>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</div>
            <div>URL Preview: {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30)}...</div>
          </div>
        </div>
      </div>
    </div>
  );
} 