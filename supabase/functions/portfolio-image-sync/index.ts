import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StorageEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record?: {
    id?: string
    name?: string
    bucket_id?: string
  }
  old_record?: {
    id?: string
    name?: string
    bucket_id?: string
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

    // Parse the webhook payload
    const payload: StorageEvent = await req.json()
    
    console.log('Storage event received:', JSON.stringify(payload, null, 2))

    // Only process events from the 'portfolio' bucket
    if (payload.record?.bucket_id !== 'portfolio' && payload.old_record?.bucket_id !== 'portfolio') {
      console.log('Ignoring event - not from portfolio bucket')
      return new Response(
        JSON.stringify({ message: 'Event ignored - not from portfolio bucket' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Extract portfolio UUID from file path
    const filePath = payload.record?.name || payload.old_record?.name
    if (!filePath) {
      console.log('No file path found in event')
      return new Response(
        JSON.stringify({ error: 'No file path found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    console.log('Processing file path:', filePath)

    // Parse portfolio UUID from path: portfolio/{uuid}/before_images/... or portfolio/{uuid}/after_images/...
    const pathMatch = filePath.match(/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/(before_images|after_images)\//)
    
    if (!pathMatch) {
      console.log('File path does not match expected portfolio structure:', filePath)
      return new Response(
        JSON.stringify({ 
          message: 'File path does not match portfolio structure',
          filePath,
          expectedPattern: '{uuid}/before_images/... or {uuid}/after_images/...'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const [, portfolioId, imageType] = pathMatch
    console.log('Extracted portfolio ID:', portfolioId, 'Image type:', imageType)

    // Check if portfolio exists
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id, title')
      .eq('id', portfolioId)
      .single()

    if (portfolioError || !portfolio) {
      console.log('Portfolio not found:', portfolioId, portfolioError)
      return new Response(
        JSON.stringify({ 
          error: 'Portfolio not found',
          portfolioId,
          originalError: portfolioError 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    console.log('Found portfolio:', portfolio.title)

    // Handle DELETE events more efficiently
    if (payload.type === 'DELETE' && payload.old_record?.name) {
      const deletedFilePath = payload.old_record.name
      console.log('Handling DELETE event for file:', deletedFilePath)

      // Extract the file path components
      const deletePathMatch = deletedFilePath.match(/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})\/(before_images|after_images)\/(.+)$/)

      if (deletePathMatch) {
        const [, deletePortfolioId, deleteImageType, fileName] = deletePathMatch

        if (deletePortfolioId === portfolioId) {
          // Get current portfolio data
          const { data: currentPortfolio, error: currentError } = await supabase
            .from('portfolio')
            .select('before_images, after_images')
            .eq('id', portfolioId)
            .single()

          if (currentError) {
            console.error('Error fetching current portfolio data:', currentError)
            // Fall back to full sync
          } else {
            // Generate the URL that should be removed
            const { data: urlData } = supabase.storage
              .from('portfolio')
              .getPublicUrl(deletedFilePath)
            const urlToRemove = urlData.publicUrl

            console.log('Removing URL from database:', urlToRemove)

            // Remove the specific URL from the appropriate array
            let beforeImages = Array.isArray(currentPortfolio.before_images) ? [...currentPortfolio.before_images] : []
            let afterImages = Array.isArray(currentPortfolio.after_images) ? [...currentPortfolio.after_images] : []

            if (deleteImageType === 'before_images') {
              beforeImages = beforeImages.filter(url => url !== urlToRemove)
              console.log(`Removed from before_images. Count: ${currentPortfolio.before_images?.length || 0} → ${beforeImages.length}`)
            } else if (deleteImageType === 'after_images') {
              afterImages = afterImages.filter(url => url !== urlToRemove)
              console.log(`Removed from after_images. Count: ${currentPortfolio.after_images?.length || 0} → ${afterImages.length}`)
            }

            // Update the portfolio with the filtered arrays
            const { data: updateData, error: updateError } = await supabase
              .from('portfolio')
              .update({
                before_images: beforeImages,
                after_images: afterImages,
                updated_at: new Date().toISOString()
              })
              .eq('id', portfolioId)
              .select()

            if (updateError) {
              console.error('Error updating portfolio after DELETE:', updateError)
              // Fall back to full sync below
            } else {
              console.log('Successfully removed deleted image URL from portfolio')
              return new Response(
                JSON.stringify({
                  success: true,
                  portfolioId,
                  portfolioTitle: portfolio.title,
                  action: 'DELETE',
                  removedUrl: urlToRemove,
                  beforeImagesCount: beforeImages.length,
                  afterImagesCount: afterImages.length,
                  filePath: deletedFilePath
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                  status: 200
                }
              )
            }
          }
        }
      }
    }

    console.log('Performing full sync (fallback or non-DELETE event)')

    // Get all files for this portfolio (full sync approach)
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

    if (beforeError) {
      console.log('Error listing before_images:', beforeError)
    }
    if (afterError) {
      console.log('Error listing after_images:', afterError)
    }

    // Filter for image files and create full URLs
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg']
    
    const beforeImages = (beforeFiles || [])
      .filter((file: any) => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        return ext && imageExtensions.includes(ext)
      })
      .map((file: any) => {
        const { data } = supabase.storage
          .from('portfolio')
          .getPublicUrl(`${portfolioId}/before_images/${file.name}`)
        return data.publicUrl
      })

    const afterImages = (afterFiles || [])
      .filter((file: any) => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        return ext && imageExtensions.includes(ext)
      })
      .map((file: any) => {
        const { data } = supabase.storage
          .from('portfolio')
          .getPublicUrl(`${portfolioId}/after_images/${file.name}`)
        return data.publicUrl
      })

    console.log('Found images:', {
      before: beforeImages.length,
      after: afterImages.length,
      beforeImages,
      afterImages
    })

    // Update the portfolio record
    const { data: updateData, error: updateError } = await supabase
      .from('portfolio')
      .update({
        before_images: beforeImages,
        after_images: afterImages,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolioId)
      .select()

    if (updateError) {
      console.error('Error updating portfolio:', updateError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to update portfolio',
          portfolioId,
          updateError 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('Successfully updated portfolio:', portfolioId)

    return new Response(
      JSON.stringify({
        success: true,
        portfolioId,
        portfolioTitle: portfolio.title,
        beforeImages,
        afterImages,
        event: payload.type,
        filePath
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
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