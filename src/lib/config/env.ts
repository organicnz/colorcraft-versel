import { z } from 'zod';

// Helper to clean API keys of common format issues
const cleanApiKey = (key: string): string => {
  if (!key) return key;
  return key.trim().replace(/\s/g, '').replace(/\n/g, '');
};

// Schema for environment variables with validation
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).transform(cleanApiKey),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).transform(cleanApiKey),
  
  // Resend
  RESEND_API_KEY: z.string().min(1).transform(cleanApiKey),
  NEXT_PUBLIC_EMAIL_FROM: z.string().optional().default('Color & Craft <contact@colorcraft.live>'),
  
  // Site URL
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('http://localhost:3000'),
});

// Function to get environment variables with type safety
export function getEnv() {
  try {
    // Validate environment variables
    const env = envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NEXT_PUBLIC_EMAIL_FROM: process.env.NEXT_PUBLIC_EMAIL_FROM,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    });
    
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingEnvVars = error.errors
        .map(err => err.path.join('.'))
        .join(', ');
      
      console.error(`❌ Missing or invalid environment variables: ${missingEnvVars}`);
      console.error('Please check your .env.local file');
    } else {
      console.error('❌ Error parsing environment variables:', error);
    }
    
    // Return partial env with undefined values for missing variables
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: cleanApiKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      SUPABASE_SERVICE_ROLE_KEY: cleanApiKey(process.env.SUPABASE_SERVICE_ROLE_KEY || ''),
      RESEND_API_KEY: cleanApiKey(process.env.RESEND_API_KEY || ''),
      NEXT_PUBLIC_EMAIL_FROM: process.env.NEXT_PUBLIC_EMAIL_FROM || 'Color & Craft <contact@colorcraft.live>',
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    } as any;
  }
}

// Export environment variables
export const env = getEnv();
