import { createServerClient } from '@supabase/ssr'
import { env } from '@/lib/config/env'

// Create a version that works during build time
export const createClient = () => {
  // During build, provide a dummy implementation that won't fail
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    return createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return ''
          },
          set(name, value, options) {
            // Do nothing during build
          },
          remove(name, options) {
            // Do nothing during build
          },
        },
      }
    )
  }
  
  // In actual server runtime, dynamically import cookies
  // This prevents build-time errors with next/headers
  try {
    // @ts-ignore - This is a dynamic import that will only run at runtime
    const { cookies } = require('next/headers')
    const cookieStore = cookies()
    
    return createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value
          },
          set(name, value, options) {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // This will fail in middleware, but we can ignore it
              console.debug('Cookie set error (expected in middleware):', error)
            }
          },
          remove(name, options) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 })
            } catch (error) {
              // This will fail in middleware, but we can ignore it
              console.debug('Cookie remove error (expected in middleware):', error)
            }
          },
        },
      }
    )
  } catch (error) {
    console.debug('Cookie handler initialization error:', error)
    
    // Fallback for any other context
    return createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return ''
          },
          set(name, value, options) {
            // No-op
          },
          remove(name, options) {
            // No-op
          },
        },
      }
    )
  }
}

// Simplified auth helper for server actions and server components
export async function auth() {
  const supabase = createClient();
  return supabase.auth.getSession();
}