import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { RedisService, CACHE_KEYS, CACHE_DURATION } from '@/lib/upstash/redis'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const useCache = searchParams.get('cache') !== 'false'
    const refresh = searchParams.get('refresh') === 'true'

    // If refresh is requested, clear the cache first
    if (refresh) {
      await RedisService.del(CACHE_KEYS.PORTFOLIO_PROJECTS)
      await RedisService.del(CACHE_KEYS.PORTFOLIO_STATS)
    }

    // Function to fetch fresh data from Supabase
    const fetchPortfolioData = async () => {
      const supabase = await createClient()
      
      // Fetch portfolio projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (projectsError) {
        throw new Error(`Failed to fetch projects: ${projectsError.message}`)
      }

      // Calculate stats
      const stats = {
        total: projects?.length || 0,
        featured: projects?.filter(p => p.is_featured).length || 0,
        recent: projects?.filter(p => {
          const createdAt = new Date(p.created_at)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return createdAt > thirtyDaysAgo
        }).length || 0,
        categories: [...new Set(projects?.flatMap(p => p.techniques || []) || [])].length
      }

      return {
        projects: projects || [],
        stats,
        cached: false,
        timestamp: new Date().toISOString()
      }
    }

    let portfolioData

    if (useCache) {
      // Try to get from cache with automatic refresh if not found
      portfolioData = await RedisService.cache(
        CACHE_KEYS.PORTFOLIO_PROJECTS,
        fetchPortfolioData,
        CACHE_DURATION.MEDIUM // 30 minutes
      )
      
      if (portfolioData) {
        portfolioData.cached = true
      }
    } else {
      // Fetch fresh data without caching
      portfolioData = await fetchPortfolioData()
    }

    if (!portfolioData) {
      return NextResponse.json(
        { error: 'Failed to fetch portfolio data' },
        { status: 500 }
      )
    }

    // Add cache headers
    const headers = new Headers()
    if (portfolioData.cached) {
      headers.set('X-Cache', 'HIT')
      headers.set('Cache-Control', 'public, max-age=1800') // 30 minutes
    } else {
      headers.set('X-Cache', 'MISS')
      headers.set('Cache-Control', 'public, max-age=60') // 1 minute for fresh data
    }

    return NextResponse.json(portfolioData, { headers })

  } catch (error) {
    console.error('Portfolio API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Example of rate limiting with Redis
export async function POST(req: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

    const rateLimitKey = CACHE_KEYS.API_RATE_LIMIT(clientIP)
    
    // Check current request count
    const currentRequests = await RedisService.get<number>(rateLimitKey) || 0
    const maxRequests = 10 // 10 requests per minute
    
    if (currentRequests >= maxRequests) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: `Maximum ${maxRequests} requests per minute allowed`,
          retryAfter: 60
        },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString()
          }
        }
      )
    }

    // Increment request count
    await RedisService.incr(rateLimitKey)
    
    // Set expiration if this is the first request
    if (currentRequests === 0) {
      await RedisService.expire(rateLimitKey, 60) // 1 minute
    }

    // Process the actual request (example: update portfolio data)
    const body = await req.json()
    
    // Simulate some processing
    console.log('Processing portfolio update:', body)
    
    // Clear cache after update
    await RedisService.del(CACHE_KEYS.PORTFOLIO_PROJECTS)
    await RedisService.del(CACHE_KEYS.PORTFOLIO_STATS)

    return NextResponse.json({
      success: true,
      message: 'Portfolio updated successfully',
      rateLimitRemaining: maxRequests - currentRequests - 1
    })

  } catch (error) {
    console.error('Portfolio POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 