import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This is a placeholder implementation for build purposes
// In server components, use the createServerActionClient from @supabase/auth-helpers-nextjs
export const createClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
          }
        },
        remove(name, options) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch (error) {
            // This will fail in middleware, but we can ignore it
          }
        },
      },
    }
  )
} 