"use client";

import { useFeatureFlag } from "@/lib/features/useFeatureFlag";
import { FEATURE_FLAGS } from "@/lib/features";
import { Button } from "./button";

export default function FeatureFlagExample() {
  const { enabled: darkModeEnabled, loading: darkModeLoading } = useFeatureFlag(FEATURE_FLAGS.DARK_MODE);
  const { enabled: enhancedContactEnabled, loading: enhancedContactLoading } = useFeatureFlag(FEATURE_FLAGS.ENHANCED_CONTACT_FORM);
  const { enabled: analyticsEnabled, loading: analyticsLoading } = useFeatureFlag(FEATURE_FLAGS.DASHBOARD_ANALYTICS);

  if (darkModeLoading || enhancedContactLoading || analyticsLoading) {
    return <div>Loading feature flags...</div>;
  }

  return (
    <div className="p-4 border rounded-md space-y-4">
      <h2 className="text-lg font-bold">Feature Flag Status</h2>
      
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <span>Dark Mode:</span>
          <span className={`px-2 py-1 rounded text-sm ${darkModeEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {darkModeEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Enhanced Contact Form:</span>
          <span className={`px-2 py-1 rounded text-sm ${enhancedContactEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {enhancedContactEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span>Dashboard Analytics:</span>
          <span className={`px-2 py-1 rounded text-sm ${analyticsEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {analyticsEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
      
      {darkModeEnabled && (
        <div className="p-3 bg-gray-800 text-white rounded">
          This content only appears when Dark Mode is enabled.
        </div>
      )}
      
      {enhancedContactEnabled && (
        <div className="p-3 bg-blue-100 text-blue-800 rounded">
          Enhanced contact form features are available.
        </div>
      )}
      
      {analyticsEnabled && (
        <div className="p-3 bg-purple-100 text-purple-800 rounded">
          Analytics dashboard is available.
        </div>
      )}
    </div>
  );
} 