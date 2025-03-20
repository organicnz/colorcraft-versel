import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (code) {
    const cookieStore = cookies()
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
        const { error } = await supabase.from('users').insert({
          id: userId,
          full_name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
          email: session.user.email,
          role: 'customer',
        })
        
        if (error) {
          console.error('Error creating user profile:', error)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + '/dashboard')
} 