import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Gather environment variable info
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    const envInfo = {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'exists' : 'missing',
      NEXT_PUBLIC_SUPABASE_URL_length: supabaseUrl?.length || 0,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'exists' : 'missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY_length: supabaseAnonKey?.length || 0,
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey ? 'exists' : 'missing',
      SUPABASE_SERVICE_ROLE_KEY_length: supabaseServiceRoleKey?.length || 0
    };
    
    console.log('Environment variables check:', envInfo);
    
    const results = {
      envInfo,
      anonKeyTest: null,
      serviceRoleTest: null
    };
    
    // Test anon key connection
    if (supabaseUrl && supabaseAnonKey) {
      try {
        console.log('Testing anon key connection...');
        const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
        const { data: anonData, error: anonError } = await supabaseAnon
          .from('_schema_migrations')
          .select('*')
          .limit(1);
          
        if (anonError) {
          results.anonKeyTest = {
            success: false,
            error: {
              message: anonError.message,
              hint: anonError.hint,
              code: anonError.code
            }
          };
        } else {
          results.anonKeyTest = {
            success: true,
            message: 'Successfully connected with anon key'
          };
        }
      } catch (error: any) {
        results.anonKeyTest = {
          success: false,
          error: error.message
        };
      }
    }
    
    // Test service role key connection
    if (supabaseUrl && supabaseServiceRoleKey) {
      try {
        console.log('Testing service role key connection...');
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
        const { data: serviceData, error: serviceError } = await supabaseAdmin
          .from('_schema_migrations')
          .select('*')
          .limit(1);
          
        if (serviceError) {
          results.serviceRoleTest = {
            success: false,
            error: {
              message: serviceError.message,
              hint: serviceError.hint,
              code: serviceError.code
            }
          };
        } else {
          results.serviceRoleTest = {
            success: true,
            message: 'Successfully connected with service role key'
          };
        }
      } catch (error: any) {
        results.serviceRoleTest = {
          success: false,
          error: error.message
        };
      }
    }
    
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'An unexpected error occurred',
      error: error.message
    }, { status: 500 });
  }
} 