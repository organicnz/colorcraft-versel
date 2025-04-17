import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/config/env'

export const createClient = () => {
  try {
    return createBrowserClient(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  } catch (error) {
    console.error('Error initializing Supabase browser client:', error)
    throw error
  }
} 