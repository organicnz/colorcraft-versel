"use client";

import { useFeatureFlag } from "@/lib/features/useFeatureFlag";
import { FEATURE_FLAGS } from "@/lib/features/feature-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeatureExample() {
  const { enabled: darkModeEnabled } = useFeatureFlag(FEATURE_FLAGS.DARK_MODE.name);
  const { enabled: enhancedContactEnabled } = useFeatureFlag(FEATURE_FLAGS.ENHANCED_CONTACT_FORM.name);

  return (
    <div className="space-y-6">
      <Card className={darkModeEnabled ? "bg-slate-800 text-white" : "bg-white"}>
        <CardHeader>
          <CardTitle>Dark Mode Example</CardTitle>
          <CardDescription className={darkModeEnabled ? "text-slate-300" : ""}>
            This card changes appearance based on the dark mode feature flag
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The dark mode feature is currently:{" "}
            <span className="font-bold">{darkModeEnabled ? "Enabled" : "Disabled"}</span>
          </p>
        </CardContent>
        <CardFooter>
          <Button variant={darkModeEnabled ? "outline" : "default"}>Styled Button</Button>
        </CardFooter>
      </Card>

      {enhancedContactEnabled && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Contact Options</CardTitle>
            <CardDescription>
              This section only appears when the enhanced contact form feature is enabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              The enhanced contact form provides additional options like service selection,
              scheduling, and priority support requests.
            </p>
          </CardContent>
          <CardFooter>
            <Button>Schedule Consultation</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
