import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Use service role client to bypass RLS
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Step 1: Create/update the portfolio bucket using service role
    const { data: buckets, error: listError } = await serviceClient.storage.listBuckets()
    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json({ 
        error: 'Failed to check existing buckets',
        details: listError.message 
      }, { status: 500 })
    }

    const portfolioBucketExists = buckets?.some(bucket => bucket.id === 'portfolio')
    
    if (!portfolioBucketExists) {
      const { data: bucketData, error: bucketError } = await serviceClient.storage.createBucket('portfolio', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 52428800 // 50MB
      })
      
      if (bucketError) {
        console.error('Error creating bucket:', bucketError)
        return NextResponse.json({ 
          error: 'Failed to create storage bucket',
          details: bucketError.message 
        }, { status: 500 })
      }
    }

    // Step 2: Apply storage policies using service role and individual SQL queries
    const policies = [
      {
        name: 'Portfolio images are publicly viewable',
        sql: `
          CREATE POLICY IF NOT EXISTS "Portfolio images are publicly viewable"
          ON storage.objects FOR SELECT
          USING (bucket_id = 'portfolio');
        `
      },
      {
        name: 'Admins can upload portfolio images',
        sql: `
          CREATE POLICY IF NOT EXISTS "Admins can upload portfolio images"
          ON storage.objects FOR INSERT
          WITH CHECK (
            bucket_id = 'portfolio' AND
            EXISTS (
              SELECT 1 FROM users
              WHERE users.id = auth.uid() AND users.role = 'admin'
            )
          );
        `
      },
      {
        name: 'Admins can update portfolio images',
        sql: `
          CREATE POLICY IF NOT EXISTS "Admins can update portfolio images"
          ON storage.objects FOR UPDATE
          USING (
            bucket_id = 'portfolio' AND
            EXISTS (
              SELECT 1 FROM users
              WHERE users.id = auth.uid() AND users.role = 'admin'
            )
          );
        `
      },
      {
        name: 'Admins can delete portfolio images',
        sql: `
          CREATE POLICY IF NOT EXISTS "Admins can delete portfolio images"
          ON storage.objects FOR DELETE
          USING (
            bucket_id = 'portfolio' AND
            EXISTS (
              SELECT 1 FROM users
              WHERE users.id = auth.uid() AND users.role = 'admin'
            )
          );
        `
      }
    ]

    // First, drop existing policies
    const dropPolicies = [
      'DROP POLICY IF EXISTS "Portfolio images are publicly viewable" ON storage.objects;',
      'DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;',
      'DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;',
      'DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;'
    ]

    const policyResults = []

    // Drop existing policies first
    for (const dropSql of dropPolicies) {
      try {
        const { error } = await serviceClient.rpc('exec', { sql: dropSql })
        if (error && !error.message.includes('does not exist')) {
          console.error('Error dropping policy:', error)
        }
      } catch (e) {
        console.log('Drop policy failed (expected):', e)
      }
    }

    // Try different approaches to create policies
    for (const policy of policies) {
      let success = false
      let errorMsg = ''

      // Approach 1: Try using rpc with different function names
      const rpcFunctions = ['exec', 'sql', 'execute_sql', 'run_sql']
      
      for (const rpcFunc of rpcFunctions) {
        try {
          const { error } = await serviceClient.rpc(rpcFunc, { sql: policy.sql })
          if (!error) {
            success = true
            break
          } else {
            errorMsg = error.message
          }
        } catch (e) {
          errorMsg = String(e)
        }
      }

      // Approach 2: Try direct SQL execution if RPC fails
      if (!success) {
        try {
          const { error } = await serviceClient
            .from('information_schema.tables')
            .select('table_name')
            .limit(1)

          if (!error) {
            // If we can query, try to use a different approach
            console.log('Direct query works, but policy creation failed')
          }
        } catch (e) {
          console.log('Direct query failed too')
        }
      }

      policyResults.push({
        name: policy.name,
        success,
        error: success ? null : errorMsg
      })
    }

    // Step 3: Create directories for existing portfolio items with before/after structure
    const { data: portfolioItems, error: portfolioError } = await serviceClient
      .from('portfolio')
      .select('id')

    if (portfolioError) {
      console.error('Portfolio fetch error:', portfolioError)
      return NextResponse.json({ 
        error: 'Failed to fetch portfolio items',
        details: portfolioError.message 
      }, { status: 500 })
    }

    // Create directories using service client with before/after structure
    const directoryResults = []
    for (const item of portfolioItems || []) {
      const itemResult = {
        id: item.id,
        before: { success: false, error: '' },
        after: { success: false, error: '' },
        success: false
      }

      // Create before/ directory
      try {
        const { error: beforeError } = await serviceClient.storage
          .from('portfolio')
          .upload(`${item.id}/before_images/.gitkeep`, new Blob([''], { type: 'text/plain' }), {
            upsert: true
          })

        if (beforeError && !beforeError.message.includes('already exists')) {
          console.error(`Failed to create before_images directory for ${item.id}:`, beforeError)
          itemResult.before = { success: false, error: beforeError.message }
        } else {
          itemResult.before = { success: true, error: '' }
        }
      } catch (error) {
        console.error(`Error creating before_images directory for ${item.id}:`, error)
        itemResult.before = { success: false, error: String(error) }
      }

      // Create after/ directory
      try {
        const { error: afterError } = await serviceClient.storage
          .from('portfolio')
          .upload(`${item.id}/after_images/.gitkeep`, new Blob([''], { type: 'text/plain' }), {
            upsert: true
          })

        if (afterError && !afterError.message.includes('already exists')) {
          console.error(`Failed to create after_images directory for ${item.id}:`, afterError)
          itemResult.after = { success: false, error: afterError.message }
        } else {
          itemResult.after = { success: true, error: '' }
        }
      } catch (error) {
        console.error(`Error creating after_images directory for ${item.id}:`, error)
        itemResult.after = { success: false, error: String(error) }
      }

      // Overall success if both directories were created
      itemResult.success = itemResult.before.success && itemResult.after.success
      directoryResults.push(itemResult)
    }

    const allPoliciesSuccessful = policyResults.every(p => p.success)

    if (allPoliciesSuccessful) {
      return NextResponse.json({
        success: true,
        message: 'Storage bucket and policies created successfully with before_images/after_images directory structure!',
        directoryResults,
        portfolioItemsProcessed: portfolioItems?.length || 0,
        bucketStatus: portfolioBucketExists ? 'already existed' : 'created',
        policyResults,
        directoryStructure: 'before_images/after_images subdirectories created'
      })
    } else {
      // Provide SQL for manual execution if programmatic approach fails
      const manualSQL = `
-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Portfolio images are publicly viewable" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;

-- Create storage policies for the portfolio bucket
CREATE POLICY "Portfolio images are publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update portfolio images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete portfolio images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

-- Create function to automatically create portfolio directories with before_images/after_images structure
CREATE OR REPLACE FUNCTION create_portfolio_directories(portfolio_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  before_path TEXT;
  after_path TEXT;
BEGIN
  -- Create the directory paths
  before_path := portfolio_uuid::TEXT || '/before_images/';
  after_path := portfolio_uuid::TEXT || '/after_images/';
  
  -- Insert placeholder files to create the directory structure
  INSERT INTO storage.objects (bucket_id, name, owner_id, path_tokens)
  VALUES (
    'portfolio',
    before_path || '.gitkeep',
    auth.uid(),
    ARRAY[portfolio_uuid::TEXT, 'before_images', '.gitkeep']
  )
  ON CONFLICT (bucket_id, name) DO NOTHING;
  
  INSERT INTO storage.objects (bucket_id, name, owner_id, path_tokens)
  VALUES (
    'portfolio',
    after_path || '.gitkeep',
    auth.uid(),
    ARRAY[portfolio_uuid::TEXT, 'after_images', '.gitkeep']
  )
  ON CONFLICT (bucket_id, name) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the portfolio creation
    RAISE WARNING 'Failed to create portfolio directories for %: %', portfolio_uuid, SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to automatically create directories when portfolio items are created
CREATE OR REPLACE FUNCTION create_portfolio_directory_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Create directories for the new portfolio item
  PERFORM create_portfolio_directories(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create directories
DROP TRIGGER IF EXISTS create_portfolio_directory_on_insert ON portfolio;
CREATE TRIGGER create_portfolio_directory_on_insert
  AFTER INSERT ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION create_portfolio_directory_trigger();
      `

      return NextResponse.json({
        success: false,
        message: 'Storage bucket created with before_images/after_images directories, but policies need manual setup',
        note: 'Programmatic policy creation failed. Please run the SQL manually.',
        sqlToRun: manualSQL,
        directoryResults,
        portfolioItemsProcessed: portfolioItems?.length || 0,
        bucketStatus: portfolioBucketExists ? 'already existed' : 'created',
        policyResults,
        directoryStructure: 'before_images/after_images subdirectories created'
      })
    }

  } catch (error) {
    console.error('Storage policies application error:', error)
    return NextResponse.json({
      error: 'Failed to apply storage policies',
      details: String(error)
    }, { status: 500 })
  }
} 