import { createClient as createClientBase } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'defined' : 'undefined',
      key: supabaseKey ? `defined (${supabaseKey.substring(0, 10)}...)` : 'undefined'
    });
    throw new Error('Missing Supabase environment variables');
  }

  try {
    const cookieStore = cookies();

    return createClientBase(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string; domain?: string; maxAge?: number; httpOnly?: boolean; secure?: boolean; sameSite?: 'strict' | 'lax' | 'none' }) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    });
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    throw error;
  }
} 