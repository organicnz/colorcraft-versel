import { NextResponse } from 'next/server'
import { RedisService, CACHE_KEYS, CACHE_DURATION } from '@/lib/upstash/redis'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    console.log('🔍 Starting Redis caching demo...')
    
    // 1. Try to get data from cache first
    const cacheKey = CACHE_KEYS.PORTFOLIO_PROJECTS
    console.log(`📋 Checking cache for key: ${cacheKey}`)
    
    const portfolioData = await RedisService.get(cacheKey)
    
    if (portfolioData) {
      console.log('🎯 Cache HIT! Data found in Redis')
      return NextResponse.json({
        success: true,
        source: 'cache',
        data: portfolioData,
        message: 'Data retrieved from Redis cache',
        performance: 'Fast response from cache'
      })
    }
    
    console.log('❌ Cache MISS. Fetching from Supabase...')
    
    // 2. If not in cache, fetch from database
    const supabase = await createClient()
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, title, brief_description, status, created_at')
      .eq('status', 'published')
      .limit(5)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }
    
    // 3. Store in cache with expiration
    const dataToCache = {
      projects: projects || [],
      totalCount: projects?.length || 0,
      lastUpdated: new Date().toISOString(),
    }
    
    const cached = await RedisService.set(
      cacheKey, 
      dataToCache, 
      CACHE_DURATION.SHORT // 5 minutes
    )
    
    console.log(`💾 Data cached successfully: ${cached}`)
    
    return NextResponse.json({
      success: true,
      source: 'database',
      data: dataToCache,
      message: 'Data fetched from database and cached in Redis',
      performance: 'Slower initial fetch, subsequent requests will be faster'
    })
    
  } catch (error) {
    console.error('🚨 Redis demo error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to demonstrate Redis caching',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    console.log('🧪 Testing Redis operations...')
    
    const testKey = 'demo:test-operations'
    const testData = {
      timestamp: new Date().toISOString(),
      operation: 'POST demo',
      random: Math.random(),
    }
    
    // Demonstrate various Redis operations
    const operations = []
    
    // 1. SET operation
    const setResult = await RedisService.set(testKey, testData, 300) // 5 minutes
    operations.push({ 
      operation: 'SET', 
      success: setResult,
      description: 'Store data with 5 minute expiration'
    })
    
    // 2. GET operation
    const getData = await RedisService.get(testKey)
    operations.push({ 
      operation: 'GET', 
      success: !!getData,
      data: getData,
      description: 'Retrieve stored data'
    })
    
    // 3. EXISTS operation
    const exists = await RedisService.exists(testKey)
    operations.push({ 
      operation: 'EXISTS', 
      result: exists,
      description: 'Check if key exists'
    })
    
    // 4. TTL operation
    const ttl = await RedisService.ttl(testKey)
    operations.push({ 
      operation: 'TTL', 
      result: ttl,
      description: 'Get time-to-live in seconds'
    })
    
    // 5. INCR operation (for counters)
    const counterKey = 'demo:api-calls'
    const counter = await RedisService.incr(counterKey)
    operations.push({ 
      operation: 'INCR', 
      result: counter,
      description: 'Increment API call counter'
    })
    
    return NextResponse.json({
      success: true,
      message: 'Redis operations test completed',
      operations,
      summary: {
        totalOperations: operations.length,
        allSuccessful: operations.every(op => op.success !== false),
        testKey,
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('🚨 Redis operations test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test Redis operations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    console.log('🧹 Cleaning up demo cache keys...')
    
    const keysToDelete = [
      CACHE_KEYS.PORTFOLIO_PROJECTS,
      'demo:test-operations',
      'demo:api-calls'
    ]
    
    const deleteResults = []
    
        for (const key of keysToDelete) {
      const deleted = await RedisService.del(key)
      const deletedCount = typeof deleted === 'number' ? deleted : (deleted ? 1 : 0)
      deleteResults.push({
        key,
        deleted: deletedCount > 0,
        count: deletedCount
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Demo cache cleanup completed',
      deletedKeys: deleteResults,
      totalDeleted: deleteResults.reduce((sum, result) => sum + result.count, 0)
    })
    
  } catch (error) {
    console.error('🚨 Cache cleanup error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to clean up cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 