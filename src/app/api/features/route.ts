import { NextRequest, NextResponse } from "next/server";
import { isFeatureEnabled } from "@/lib/features";
import { apiLogger } from "@/lib/logger";
import { Feature_definitions } from "@/lib/features/feature-list";

/**
 * GET /api/features
 * Check if a feature flag is enabled
 *
 * Query parameters:
 * - feature: Feature flag name to check
 * - userId: Optional user ID for user targeting
 */
export async function GET(req: NextRequest) {
  // Extract query params
  const url = new URL(req.url);
  const feature = url.searchParams.get("feature");
  const userId = url.searchParams.get("userId");

  // Log request
  apiLogger.info("Feature flag check request", {
    metadata: { feature, userId },
  });

  // Validate feature param
  if (!feature) {
    return NextResponse.json({ error: "Missing feature parameter" }, { status: 400 });
  }

  try {
    // Find the feature definition
    const featureDefinition = Feature_definitions.find((f) => f.name === feature);

    if (!featureDefinition) {
      return NextResponse.json({ error: "Unknown feature flag" }, { status: 404 });
    }

    // Check if feature is enabled
    const isEnabled = isFeatureEnabled(featureDefinition.name, userId || undefined);

    // Return result
    return NextResponse.json({ enabled: isEnabled });
  } catch (error) {
    // Log error
    apiLogger.error("Error checking feature flag", {
      metadata: {
        feature,
        userId,
        error: error instanceof Error ? error.message : String(error),
      },
    });

    // Return error response
    return NextResponse.json({ error: "Could not check feature flag" }, { status: 500 });
  }
}
