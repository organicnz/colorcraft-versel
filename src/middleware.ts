import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove: (name, options) => {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Handle routing conflicts based on authentication state
  if (request.nextUrl.pathname === '/portfolio') {
    // For portfolio, redirect to marketing version if not logged in,
    // or to dashboard version if logged in
    if (session) {
      return NextResponse.redirect(new URL('/dashboard/portfolio', request.url))
    } else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (request.nextUrl.pathname === '/services') {
    // For services, redirect to marketing version if not logged in,
    // or to dashboard version if logged in
    if (session) {
      return NextResponse.redirect(new URL('/dashboard/services', request.url))
    } else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect dashboard routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // If user is logged in, check if they're an admin for dashboard access
  if (session && request.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userData || userData.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect account routes
  if (!session && request.nextUrl.pathname.startsWith('/account')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*', '/portfolio', '/services'],
}