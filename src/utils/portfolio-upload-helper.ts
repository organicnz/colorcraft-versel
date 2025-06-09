import { createClient } from '@/lib/supabase/client';

/**
 * Upload images and automatically refresh the portfolio database
 */
export async function uploadAndRefreshPortfolioImages(
  portfolioId: string,
  files: File[],
  category: 'before_images' | 'after_images'
): Promise<{
  success: boolean;
  uploadedFiles: string[];
  refreshResult?: any;
  error?: string;
}> {
  const supabase = createClient();
  const uploadedFiles: string[] = [];

  try {
    // 1. Upload files to storage
    for (const file of files) {
      const fileName = `${portfolioId}/${category}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file);

      if (error) {
        throw new Error(`Upload failed for ${file.name}: ${error.message}`);
      }

      uploadedFiles.push(fileName);
    }

    // 2. Automatically refresh the portfolio database after upload
    const { data: refreshData, error: refreshError } = await supabase.rpc(
      'refresh_portfolio_images',
      { portfolio_uuid: portfolioId }
    );

    if (refreshError) {
      console.warn('Upload succeeded but refresh failed:', refreshError);
      return {
        success: true,
        uploadedFiles,
        error: `Upload succeeded but database refresh failed: ${refreshError.message}`
      };
    }

    return {
      success: true,
      uploadedFiles,
      refreshResult: refreshData?.[0]
    };

  } catch (error: any) {
    return {
      success: false,
      uploadedFiles,
      error: error.message
    };
  }
}

/**
 * Simple refresh function to call after manual uploads
 */
export async function refreshPortfolioImages(portfolioId: string): Promise<{
  success: boolean;
  result?: any;
  error?: string;
}> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.rpc('refresh_portfolio_images', {
      portfolio_uuid: portfolioId
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      result: data?.[0]
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Trigger refresh via API endpoint (for authenticated admin users)
 */
export async function triggerPortfolioRefresh(portfolioId?: string): Promise<{
  success: boolean;
  result?: any;
  error?: string;
}> {
  try {
    const response = await fetch('/api/refresh-portfolio-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(portfolioId ? { portfolioId } : {}),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to refresh');
    }

    return {
      success: true,
      result: data
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
} 