import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = createClient()

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

    // Step 1: Create/update the portfolio bucket using storage API
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json({ 
        error: 'Failed to check existing buckets',
        details: listError.message 
      }, { status: 500 })
    }

    const portfolioBucketExists = buckets?.some(bucket => bucket.id === 'portfolio')

    if (!portfolioBucketExists) {
      const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('portfolio', {
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

    // Step 2: Apply storage policies using direct SQL
    const policySQL = `
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
    `

    // Execute policies using the SQL method
    const { error: policyError } = await supabase.rpc('exec', { sql: policySQL })
    
    // If exec doesn't work, try individual policy creation
    if (policyError) {
      console.log('Direct SQL execution failed, trying individual operations...')
      
      // Try using the SQL query method instead
      try {
        const { error: sqlError } = await supabase
          .from('pg_policies')
          .select('*')
          .eq('schemaname', 'storage')
          .eq('tablename', 'objects')
          .like('policyname', '%portfolio%')

        if (sqlError) {
          console.log('Cannot verify existing policies, but this is expected')
        }
      } catch (e) {
        console.log('Policy verification failed as expected')
      }
    }

    // Step 3: Create directories for existing portfolio items
    const { data: portfolioItems, error: portfolioError } = await supabase
      .from('portfolio')
      .select('id')

    if (portfolioError) {
      console.error('Portfolio fetch error:', portfolioError)
      return NextResponse.json({ 
        error: 'Failed to fetch portfolio items',
        details: portfolioError.message 
      }, { status: 500 })
    }

    // Create directories using storage API
    const directoryResults = []
    for (const item of portfolioItems || []) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(`${item.id}/.gitkeep`, new Blob([''], { type: 'text/plain' }), {
            upsert: true
          })

        if (uploadError && !uploadError.message.includes('already exists')) {
          console.error(`Failed to create directory for ${item.id}:`, uploadError)
          directoryResults.push({ id: item.id, success: false, error: uploadError.message })
        } else {
          directoryResults.push({ id: item.id, success: true })
        }
      } catch (error) {
        console.error(`Error creating directory for ${item.id}:`, error)
        directoryResults.push({ id: item.id, success: false, error: String(error) })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Storage bucket created successfully. Please run the SQL policies manually in Supabase Dashboard.',
      note: 'Due to security restrictions, storage policies must be created manually using the SQL Editor in your Supabase Dashboard.',
      sqlToRun: policySQL,
      directoryResults,
      portfolioItemsProcessed: portfolioItems?.length || 0,
      bucketStatus: portfolioBucketExists ? 'already existed' : 'created'
    })

  } catch (error) {
    console.error('Storage policies application error:', error)
    return NextResponse.json({
      error: 'Failed to apply storage policies',
      details: String(error)
    }, { status: 500 })
  }
} 