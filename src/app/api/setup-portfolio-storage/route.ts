import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = createClient();

    // Check if we have admin access
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get user role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check if portfolio bucket already exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    const portfolioBucketExists = buckets?.some(bucket => bucket.name === 'portfolio');

    // Apply the storage migration
    const migrationSQL = `
      -- Setup portfolio storage bucket and policies
      -- This migration creates the portfolio storage bucket and sets up proper RLS policies

      -- Create the portfolio bucket if it doesn't exist
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        'portfolio',
        'portfolio',
        true,
        52428800, -- 50MB limit
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      )
      ON CONFLICT (id) DO UPDATE SET
        public = true,
        file_size_limit = 52428800,
        allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      -- Drop existing storage policies if they exist
      DROP POLICY IF EXISTS "Portfolio images are publicly viewable" ON storage.objects;
      DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
      DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
      DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;

      -- Create storage policies for the portfolio bucket

      -- 1. Public read access for portfolio images
      CREATE POLICY "Portfolio images are publicly viewable"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'portfolio');

      -- 2. Admin upload access
      CREATE POLICY "Admins can upload portfolio images"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'portfolio' AND
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid() AND users.role = 'admin'
        )
      );

      -- 3. Admin update access
      CREATE POLICY "Admins can update portfolio images"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'portfolio' AND
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid() AND users.role = 'admin'
        )
      );

      -- 4. Admin delete access
      CREATE POLICY "Admins can delete portfolio images"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'portfolio' AND
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid() AND users.role = 'admin'
        )
      );

      -- Create a function to automatically create portfolio directories
      CREATE OR REPLACE FUNCTION create_portfolio_directory(portfolio_uuid UUID)
      RETURNS BOOLEAN AS $$
      DECLARE
        directory_path TEXT;
      BEGIN
        -- Create the directory path
        directory_path := portfolio_uuid::TEXT || '/';
        
        -- Insert a placeholder file to create the directory structure
        -- This will be replaced when actual images are uploaded
        INSERT INTO storage.objects (bucket_id, name, owner, path_tokens)
        VALUES (
          'portfolio',
          directory_path || '.gitkeep',
          auth.uid(),
          ARRAY[portfolio_uuid::TEXT, '.gitkeep']
        )
        ON CONFLICT (bucket_id, name) DO NOTHING;
        
        RETURN TRUE;
      EXCEPTION
        WHEN OTHERS THEN
          -- Log the error but don't fail the portfolio creation
          RAISE WARNING 'Failed to create portfolio directory for %: %', portfolio_uuid, SQLERRM;
          RETURN FALSE;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create a trigger function to automatically create directories when portfolio items are created
      CREATE OR REPLACE FUNCTION create_portfolio_directory_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Create directory for the new portfolio item
        PERFORM create_portfolio_directory(NEW.id);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create trigger to auto-create directories
      DROP TRIGGER IF EXISTS create_portfolio_directory_on_insert ON portfolio;
      CREATE TRIGGER create_portfolio_directory_on_insert
        AFTER INSERT ON portfolio
        FOR EACH ROW
        EXECUTE FUNCTION create_portfolio_directory_trigger();

      -- Grant necessary permissions
      GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;
      GRANT ALL ON storage.objects TO postgres, anon, authenticated, service_role;
      GRANT ALL ON storage.buckets TO postgres, anon, authenticated, service_role;
    `;

    const { error: migrationError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (migrationError) {
      return NextResponse.json({ 
        error: 'Storage migration failed', 
        details: migrationError.message 
      }, { status: 500 });
    }

    // Verify the bucket was created successfully
    const { data: updatedBuckets, error: verifyError } = await supabase.storage.listBuckets();
    
    const portfolioBucketCreated = updatedBuckets?.some(bucket => bucket.name === 'portfolio');

    // Test upload permissions
    let uploadTest = null;
    try {
      // Try to create a test directory
      const testContent = new Uint8Array([]);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload('test/.gitkeep', testContent, {
          contentType: 'text/plain',
          upsert: true
        });

      if (!uploadError) {
        // Clean up test file
        await supabase.storage.from('portfolio').remove(['test/.gitkeep']);
        uploadTest = { success: true, message: 'Upload permissions working' };
      } else {
        uploadTest = { success: false, error: uploadError.message };
      }
    } catch (error: any) {
      uploadTest = { success: false, error: error.message };
    }

    return NextResponse.json({
      success: true,
      message: 'Portfolio storage setup completed successfully',
      bucket: {
        existed: portfolioBucketExists,
        created: portfolioBucketCreated,
        name: 'portfolio'
      },
      uploadTest,
      appliedChanges: {
        createdBucket: !portfolioBucketExists,
        createdPolicies: true,
        createdFunctions: true,
        createdTriggers: true,
        grantedPermissions: true
      }
    });

  } catch (error: any) {
    console.error('Storage setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error during storage setup',
      message: error.message
    }, { status: 500 });
  }
} 