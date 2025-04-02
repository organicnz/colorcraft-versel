import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '@/lib/features';
import { FEATURES } from '@/lib/features/schema';
import { apiLogger } from '@/lib/logger';
import { errorMonitor } from '@/lib/errors/monitoring';
import { measurePerformance } from '@/lib/logger';

/**
 * GET /api/features
 * 
 * Check if a feature flag is enabled
 * 
 * Query parameters:
 * - feature: The name of the feature flag to check
 * - userId: Optional user ID for user-specific targeting
 * 
 * @returns { enabled: boolean } JSON response
 */
export async function GET(request: NextRequest) {
  return await measurePerformance('api-feature-flag-check', async () => {
    try {
      const { searchParams } = new URL(request.url);
      const featureName = searchParams.get('feature');
      const userId = searchParams.get('userId') || undefined;
      
      if (!featureName) {
        return NextResponse.json(
          { error: 'Missing feature parameter' },
          { status: 400 }
        );
      }
      
      // Find the feature configuration
      const featureConfig = Object.values(FEATURES).find(
        (f) => f.name === featureName
      );
      
      if (!featureConfig) {
        apiLogger.warn(`Unknown feature flag requested: ${featureName}`, {
          metadata: { userId }
        });
        
        return NextResponse.json(
          { enabled: false, error: 'Unknown feature' },
          { status: 404 }
        );
      }
      
      // Check if the feature is enabled
      const enabled = await isFeatureEnabled(featureConfig, { userId });
      
      apiLogger.debug(`Feature flag check: ${featureName}`, {
        metadata: { userId, enabled }
      });
      
      return NextResponse.json({ enabled });
    } catch (error) {
      errorMonitor.captureError(error as Error, {
        context: 'feature-flag-api'
      });
      
      apiLogger.error('Error checking feature flag', {
        metadata: { error: (error as Error).message }
      });
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
