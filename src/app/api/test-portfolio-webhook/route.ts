import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Test webhook triggered - simulating portfolio storage changes')

    // Create test portfolio entry
    const supabase = await createClient()

    const { portfolioId, action = 'test' } = await request.json()

    if (!portfolioId) {
      return NextResponse.json(
        { error: 'Portfolio ID is required' },
        { status: 400 }
      )
    }

    // Validate portfolio exists
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id, title, before_images, after_images')
      .eq('id', portfolioId)
      .single()

    if (portfolioError || !portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found', portfolioId },
        { status: 404 }
      )
    }

    // Get the edge function URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      return NextResponse.json(
        { error: 'Supabase URL not configured' },
        { status: 500 }
      )
    }

    // Extract project reference from URL
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0]
    const edgeFunctionUrl = `https://${projectRef}.supabase.co/functions/v1/portfolio-image-sync`

    // Create a mock storage event payload
    const mockEvent = {
      type: action.toUpperCase(),
      table: 'objects',
      record: {
        id: `mock-${Date.now()}`,
        name: `${portfolioId}/before_images/test-trigger.jpg`,
        bucket_id: 'portfolio'
      }
    }

    // Call the edge function
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify(mockEvent)
    })

    const responseData = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Edge function call failed',
          status: response.status,
          response: responseData
        },
        { status: 500 }
      )
    }

    // Get updated portfolio data
    const { data: updatedPortfolio } = await supabase
      .from('portfolio')
      .select('before_images, after_images, updated_at')
      .eq('id', portfolioId)
      .single()

    return NextResponse.json({
      success: true,
      portfolioId,
      portfolioTitle: portfolio.title,
      edgeFunctionUrl,
      mockEvent,
      edgeFunctionResponse: responseData,
      before: {
        old: portfolio.before_images,
        new: updatedPortfolio?.before_images
      },
      after: {
        old: portfolio.after_images,
        new: updatedPortfolio?.after_images
      },
      updatedAt: updatedPortfolio?.updated_at
    })

  } catch (error) {
    console.error('Test webhook error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Portfolio Webhook Test Endpoint',
    usage: {
      method: 'POST',
      body: {
        portfolioId: 'string (required)',
        action: 'string (optional, default: "test")'
      }
    },
    description: 'Tests the portfolio image sync edge function by sending a mock storage event'
  })
} 