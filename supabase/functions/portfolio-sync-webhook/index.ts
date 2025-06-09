import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record?: {
    id: string
    title?: string
    before_images?: string[]
    after_images?: string[]
  }
  old_record?: {
    id: string
    title?: string
    before_images?: string[]
    after_images?: string[]
  }
}

async function syncPortfolioImages(supabase: any, portfolioId: string) {
  console.log('Syncing images for portfolio:', portfolioId)

  try {
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

    if (beforeError) {
      console.log('Error listing before_images:', beforeError)
    }
    if (afterError) {
      console.log('Error listing after_images:', afterError)
    }

    // Filter for image files and create full paths
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg']
    
    const beforeImages = (beforeFiles || [])
      .filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        return ext && imageExtensions.includes(ext)
      })
      .map(file => `${portfolioId}/before_images/${file.name}`)

    const afterImages = (afterFiles || [])
      .filter(file => {
        const ext = file.name.split('.').pop()?.toLowerCase()
        return ext && imageExtensions.includes(ext)
      })
      .map(file => `${portfolioId}/after_images/${file.name}`)

    console.log('Found images:', {
      before: beforeImages.length,
      after: afterImages.length
    })

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
      console.error('Error updating portfolio:', updateError)
      throw updateError
    }

    console.log('Successfully synced portfolio:', portfolioId)
    return { beforeImages, afterImages }

  } catch (error) {
    console.error('Error syncing portfolio images:', error)
    throw error
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
    const payload: DatabaseWebhookPayload = await req.json()
    
    console.log('Database webhook received:', JSON.stringify(payload, null, 2))

    // Only process portfolio table events
    if (payload.table !== 'portfolio') {
      console.log('Ignoring event - not from portfolio table')
      return new Response(
        JSON.stringify({ message: 'Event ignored - not from portfolio table' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Get portfolio ID from the record
    const portfolioId = payload.record?.id || payload.old_record?.id
    if (!portfolioId) {
      console.log('No portfolio ID found in event')
      return new Response(
        JSON.stringify({ error: 'No portfolio ID found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // For DELETE events, we don't need to sync images
    if (payload.type === 'DELETE') {
      console.log('Portfolio deleted, no sync needed:', portfolioId)
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Portfolio deleted, no sync needed',
          portfolioId,
          event: payload.type
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Sync images for INSERT and UPDATE events
    const { beforeImages, afterImages } = await syncPortfolioImages(supabase, portfolioId)

    return new Response(
      JSON.stringify({
        success: true,
        portfolioId,
        portfolioTitle: payload.record?.title,
        beforeImages,
        afterImages,
        event: payload.type,
        syncedAt: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Database webhook error:', error)
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