import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SyncResult {
  portfolioId: string
  title: string
  beforeCount: number
  afterCount: number
  status: 'success' | 'error'
  error?: string
}

async function syncSinglePortfolio(supabase: any, portfolio: any): Promise<SyncResult> {
  const portfolioId = portfolio.id
  
  try {
    console.log(`Syncing portfolio: ${portfolio.title} (${portfolioId})`)

    // Get all files for this portfolio
    const { data: beforeFiles, error: beforeError } = await supabase.storage
      .from('portfolio')
      .list(`${portfolioId}/before_images`, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })

    const { data: afterFiles, error: afterError } = await supabase.storage
      .from('portfolio')
      .list(`${portfolioId}/after_images`, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })

    // Filter for image files and create full paths
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg']
    
    const beforeImages = (beforeFiles || [])
      .filter((file: any) => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        return ext && imageExtensions.includes(ext)
      })
      .map((file: any) => `${portfolioId}/before_images/${file.name}`)

    const afterImages = (afterFiles || [])
      .filter((file: any) => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        return ext && imageExtensions.includes(ext)
      })
      .map((file: any) => `${portfolioId}/after_images/${file.name}`)

    // Only update if there are changes
    const currentBefore = Array.isArray(portfolio.before_images) ? portfolio.before_images : []
    const currentAfter = Array.isArray(portfolio.after_images) ? portfolio.after_images : []
    
    const beforeChanged = JSON.stringify([...currentBefore].sort()) !== JSON.stringify([...beforeImages].sort())
    const afterChanged = JSON.stringify([...currentAfter].sort()) !== JSON.stringify([...afterImages].sort())

    if (beforeChanged || afterChanged) {
      // Update the portfolio record
      const { error: updateError } = await supabase
        .from('portfolio')
        .update({
          before_images: beforeImages,
          after_images: afterImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', portfolioId)

      if (updateError) {
        throw updateError
      }

      console.log(`✅ Updated portfolio ${portfolioId}: ${beforeImages.length} before, ${afterImages.length} after`)
    } else {
      console.log(`⏩ No changes for portfolio ${portfolioId}`)
    }

    return {
      portfolioId,
      title: portfolio.title,
      beforeCount: beforeImages.length,
      afterCount: afterImages.length,
      status: 'success'
    }

  } catch (error) {
    console.error(`❌ Error syncing portfolio ${portfolioId}:`, error)
    return {
      portfolioId,
      title: portfolio.title,
      beforeCount: 0,
      afterCount: 0,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('🔄 Starting portfolio images sync cron job...')

    // Get all portfolios
    const { data: portfolios, error: portfoliosError } = await supabase
      .from('portfolio')
      .select('id, title, before_images, after_images')
      .order('created_at', { ascending: false })

    if (portfoliosError) {
      throw new Error(`Failed to fetch portfolios: ${portfoliosError.message}`)
    }

    if (!portfolios || portfolios.length === 0) {
      console.log('No portfolios found')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No portfolios found',
          totalPortfolios: 0,
          results: []
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    console.log(`Found ${portfolios.length} portfolios to sync`)

    // Sync all portfolios (in parallel for better performance)
    const syncPromises = portfolios.map(portfolio => syncSinglePortfolio(supabase, portfolio))
    const results = await Promise.all(syncPromises)

    // Calculate summary
    const successful = results.filter(r => r.status === 'success').length
    const failed = results.filter(r => r.status === 'error').length
    const totalImages = results.reduce((sum, r) => sum + r.beforeCount + r.afterCount, 0)

    console.log(`✅ Sync completed: ${successful} successful, ${failed} failed, ${totalImages} total images`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Portfolio sync completed',
        totalPortfolios: portfolios.length,
        successful,
        failed,
        totalImages,
        syncedAt: new Date().toISOString(),
        results: results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Cron job error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
}) 