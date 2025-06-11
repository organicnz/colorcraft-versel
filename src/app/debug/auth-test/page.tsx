"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthTestPage() {
  const [status, setStatus] = useState<string>("Ready to test");
  const [logs, setLogs] = useState<string[]>([]);
  const supabase = createClient();

  const addLog = (message: string) => {
    console.warn(message);
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabaseConnection = async () => {
    setStatus("Testing Supabase connection...");
    addLog("Starting Supabase connection test");

    try {
      // Test 1: Check if client is created
      addLog("✓ Supabase client created successfully");

      // Test 2: Check auth state
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) {
        addLog(`❌ Session error: ${sessionError.message}`);
      } else {
        addLog(`✓ Session check complete. Logged in: ${!!session}`);
      }

      // Test 3: Test a simple database query
      const { data: testData, error: dbError } = await supabase
        .from("users")
        .select("count(*)")
        .limit(1);

      if (dbError) {
        addLog(`❌ Database error: ${dbError.message}`);
      } else {
        addLog("✓ Database connection successful");
      }

      setStatus("Connection test complete");
    } catch (error: any) {
      addLog(`❌ Unexpected error: ${error.message}`);
      setStatus("Connection test failed");
    }
  };

  const testSignIn = async () => {
    setStatus("Testing sign in...");
    addLog("Starting sign in test");

    const testEmail = prompt("Enter your email:");
    const testPassword = prompt("Enter your password:");

    if (!testEmail || !testPassword) {
      addLog("❌ Email or password not provided");
      setStatus("Sign in test cancelled");
      return;
    }

    try {
      addLog(`Attempting to sign in with email: ${testEmail}`);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      addLog(`Sign in response received`);
      addLog(`Has user: ${!!data?.user}`);
      addLog(`Has session: ${!!data?.session}`);

      if (error) {
        addLog(`❌ Sign in error: ${error.message}`);
        setStatus("Sign in failed");
      } else if (data?.user) {
        addLog(`✓ Sign in successful! User ID: ${data.user.id}`);
        setStatus("Sign in successful");
      } else {
        addLog("❌ Sign in returned no user data");
        setStatus("Sign in returned no data");
      }
    } catch (error: any) {
      addLog(`❌ Unexpected sign in error: ${error.message}`);
      setStatus("Sign in test failed");
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setStatus("Ready to test");
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug Test</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <p className="text-lg p-3 bg-gray-100 rounded">{status}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
        <div className="space-x-4">
          <button
            onClick={testSupabaseConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Supabase Connection
          </button>
          <button
            onClick={testSignIn}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Test Sign In
          </button>
          <button
            onClick={clearLogs}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p>No logs yet. Click a test button above.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside text-yellow-700 space-y-1">
          <li>First, click "Test Supabase Connection" to verify the basic setup</li>
          <li>Then, click "Test Sign In" and enter your actual credentials</li>
          <li>Check both the logs here and the browser console (F12)</li>
          <li>If connection works but sign in fails, check your credentials</li>
          <li>If connection fails, there's a Supabase configuration issue</li>
        </ol>
      </div>
    </div>
  );
}
