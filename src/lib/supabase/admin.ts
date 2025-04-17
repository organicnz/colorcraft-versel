import { createClient } from '@supabase/supabase-js';
import { env } from '@/lib/config/env';

/**
 * Creates a Supabase admin client with service_role key
 * IMPORTANT: This should ONLY be used in server contexts (API routes, server actions)
 * Never expose this client to the browser
 */
export const createAdminClient = () => {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase admin credentials');
    console.error({
      url_exists: Boolean(supabaseUrl),
      url_prefix: supabaseUrl ? supabaseUrl.substring(0, 10) : 'missing',
      key_exists: Boolean(supabaseServiceKey),
      key_length: supabaseServiceKey ? supabaseServiceKey.length : 0,
    });
    throw new Error('Missing Supabase admin credentials. Check your environment variables.');
  }
  
  try {
    // Trim any whitespace that might have been added to keys in env files
    const cleanedUrl = supabaseUrl.trim();
    const cleanedKey = supabaseServiceKey.trim();
    
    return createClient(cleanedUrl, cleanedKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  } catch (error) {
    console.error('Error creating Supabase admin client:', error);
    throw error;
  }
}; 