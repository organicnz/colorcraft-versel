import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createUserProfile } from '@/lib/hooks/useCreateUserProfile'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'
  
  console.log('🔍 [Auth Callback] Processing auth callback request')
  console.log('🔍 [Auth Callback] Code present:', !!code)
  console.log('🔍 [Auth Callback] Next URL:', next)
  console.log('🔍 [Auth Callback] Full URL:', url.toString())
  
  if (code) {
    console.log('🔍 [Auth Callback] Processing auth code exchange...')
    
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    try {
      console.log('🔍 [Auth Callback] Exchanging code for session...')
      
      // Exchange the code for a session
      const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ [Auth Callback] Error exchanging code for session:', error)
        return NextResponse.redirect(new URL('/auth/signin?error=callback_error', request.url))
      }

      console.log('✅ [Auth Callback] Code exchange successful')
      console.log('🔍 [Auth Callback] Session created for user:', sessionData?.user?.email)

      // Check if the user exists in the users table
      const {
        data: { session }
      } = await supabase.auth.getSession()
      
      if (session) {
        const userId = session.user.id
        console.log('🔍 [Auth Callback] Checking if user profile exists for:', userId)
        
        const { data: user } = await supabase.from('users').select('*').eq('id', userId).single()
        
        // If the user doesn't exist in the users table, create a profile
        if (!user) {
          console.log('🔍 [Auth Callback] User profile not found, creating new profile...')
          
          await createUserProfile(
            userId,
            session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
            session.user.email || '',
            'customer'
          )
          
          console.log('✅ [Auth Callback] User profile created successfully')
        } else {
          console.log('✅ [Auth Callback] User profile already exists')
        }
      } else {
        console.log('⚠️ [Auth Callback] No session found after code exchange')
      }
    } catch (error) {
      console.error('💥 [Auth Callback] Unexpected error in auth callback:', error)
      return NextResponse.redirect(new URL('/auth/signin?error=callback_error', request.url))
    }
  } else {
    console.log('⚠️ [Auth Callback] No auth code provided')
  }

  // URL to redirect to after sign in process completes
  console.log('🔍 [Auth Callback] Redirecting to:', next)
  return NextResponse.redirect(new URL(next, request.url))
} 