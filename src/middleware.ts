import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Handle the portfolio-cards redirect
  if (request.nextUrl.pathname === '/portfolio-cards') {
    return NextResponse.redirect(new URL('/portfolio', request.url));
  }
  
  // Handle the CRM redirect if needed
  if (request.nextUrl.pathname === '/crm') {
    return NextResponse.redirect(new URL('/dashboard/crm', request.url));
  }
  
  // Default Supabase auth handling
  const { supabase, response } = createClient(request);
  
  await supabase.auth.getSession();
  
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/portfolio-cards',
    '/crm',
    '/dashboard/:path*',
    '/account/:path*',
    '/api/private/:path*'
  ],
};
