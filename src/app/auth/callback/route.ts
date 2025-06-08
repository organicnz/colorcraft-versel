import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { createUserProfile } from '@/lib/hooks/useCreateUserProfile'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/dashboard'
  
  if (code) {
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

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Check if the user exists in the users table
    const { 
      data: { session }
    } = await supabase.auth.getSession()
    
    if (session) {
      const userId = session.user.id
      const { data: user } = await supabase.from('users').select('*').eq('id', userId).single()
      
      // If the user doesn't exist in the users table, create a profile
      if (!user) {
        await createUserProfile(
          userId,
          session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          session.user.email || '',
          'customer'
        )
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect('https://colorcraft.live/')
} 