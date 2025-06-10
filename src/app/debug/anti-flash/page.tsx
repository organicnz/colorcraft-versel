"use client";

import { useEffect, useState } from 'react';

export default function AntiFlashDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [pageState, setPageState] = useState('loading');

  useEffect(() => {
    // Monitor for anti-flash console logs
    const originalLog = console.log;
    const originalError = console.error;

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('anti-flash') || message.includes('Page loaded') || message.includes('Emergency fallback')) {
        setLogs(prev => [...prev, `LOG: ${message}`]);
      }
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('flash') || message.includes('Error showing page')) {
        setLogs(prev => [...prev, `ERROR: ${message}`]);
      }
      originalError.apply(console, args);
    };

    // Check page state
    const checkState = () => {
      const body = document.body;
      const hasLoaded = body.classList.contains('loaded');
      const hasTransitions = body.classList.contains('transitions-enabled');
      const isVisible = getComputedStyle(body).visibility === 'visible';
      const opacity = getComputedStyle(body).opacity;

      setPageState(`Loaded: ${hasLoaded}, Transitions: ${hasTransitions}, Visible: ${isVisible}, Opacity: ${opacity}`);
    };

    checkState();
    const interval = setInterval(checkState, 500);

    return () => {
      console.log = originalLog;
      console.error = originalError;
      clearInterval(interval);
    };
  }, []);

  const testNavigation = () => {
    window.location.href = '/';
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Anti-Flash Debug Monitor</h1>
      
      <div className="grid gap-6">
        {/* Page State */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Current Page State</h2>
          <p className="font-mono text-sm">{pageState}</p>
        </div>

        {/* Test Actions */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test Actions</h2>
          <div className="flex gap-4">
            <button 
              onClick={testNavigation}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Navigate to Home (Test Flashing)
            </button>
            <button 
              onClick={clearLogs}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Console Logs */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Anti-Flash Console Logs</h2>
          <div className="max-h-60 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 italic">No anti-flash logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="font-mono text-sm mb-1 p-2 bg-white dark:bg-gray-800 rounded">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">How to Test</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open browser DevTools (F12) and go to Console tab</li>
            <li>Click "Navigate to Home" button to test page transitions</li>
            <li>Watch for flashing during navigation</li>
            <li>Check console logs for anti-flash system messages</li>
            <li>Look for "✅ Page loaded and visible - anti-flash complete" message</li>
            <li>If flashing persists, check for "🚨 Emergency fallback activated" message</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 