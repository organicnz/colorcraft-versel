import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createClient();
  
  try {
    await supabase.auth.signOut();
    
    // Redirect to home page after sign out
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'https://colorcraft.live'));
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_SITE_URL || 'https://colorcraft.live'));
  }
} 