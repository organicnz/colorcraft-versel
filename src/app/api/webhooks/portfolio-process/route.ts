import { NextResponse } from 'next/server'
import { verifySignature } from '@upstash/qstash/nextjs'
import { createClient } from '@/lib/supabase/server'
import { RedisService, CACHE_KEYS } from '@/lib/upstash/redis'

async function handler(req: Request) {
  try {
    const body = await req.json()
    const { portfolioId, imageUrls, userId } = body

    // Validate required fields
    if (!portfolioId || !imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json(
        { error: 'Missing required fields: portfolioId, imageUrls (array)' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Process each image (simulate image processing)
    const processedImages = []
    
    for (const imageUrl of imageUrls) {
      try {
        // Here you could add image processing logic:
        // - Resize images
        // - Generate thumbnails
        // - Optimize for web
        // - Extract metadata
        
        console.log(`Processing image: ${imageUrl}`)
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        processedImages.push({
          original: imageUrl,
          processed: true,
          thumbnail: imageUrl, // In real implementation, this would be the thumbnail URL
          metadata: {
            processedAt: new Date().toISOString(),
            processingDuration: '1000ms'
          }
        })
      } catch (error) {
        console.error(`Error processing image ${imageUrl}:`, error)
        processedImages.push({
          original: imageUrl,
          processed: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Update portfolio in database
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        processed_images: processedImages,
        processing_status: 'completed',
        processed_at: new Date().toISOString()
      })
      .eq('id', portfolioId)

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update portfolio', details: updateError },
        { status: 500 }
      )
    }

    // Clear related cache
    await RedisService.del(CACHE_KEYS.PORTFOLIO_PROJECTS)
    await RedisService.del(CACHE_KEYS.PORTFOLIO_STATS)

    // Log success
    console.log(`Portfolio ${portfolioId} processed successfully:`, {
      totalImages: imageUrls.length,
      processedSuccessfully: processedImages.filter(img => img.processed).length,
      processingErrors: processedImages.filter(img => !img.processed).length,
      userId
    })

    return NextResponse.json({
      success: true,
      portfolioId,
      processedImages: processedImages.length,
      results: processedImages
    })

  } catch (error) {
    console.error('Portfolio processing webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the handler directly
export { handler as POST } 