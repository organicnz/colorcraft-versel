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

    // Apply storage policies SQL
    const storageSQL = `
      -- 1. Create the portfolio bucket if it doesn't exist
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        'portfolio',
        'portfolio',
        true,
        52428800,
        ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      )
      ON CONFLICT (id) DO UPDATE SET
        public = true,
        file_size_limit = 52428800,
        allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

      -- 2. Drop existing storage policies if they exist
      DROP POLICY IF EXISTS "Portfolio images are publicly viewable" ON storage.objects;
      DROP POLICY IF EXISTS "Admins can upload portfolio images" ON storage.objects;
      DROP POLICY IF EXISTS "Admins can update portfolio images" ON storage.objects;
      DROP POLICY IF EXISTS "Admins can delete portfolio images" ON storage.objects;

      -- 3. Create storage policies for the portfolio bucket
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

    // Execute the SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', { sql: storageSQL })
    
    if (sqlError) {
      console.error('SQL execution error:', sqlError)
      return NextResponse.json({ 
        error: 'Failed to execute storage policies SQL',
        details: sqlError.message 
      }, { status: 500 })
    }

    // Create directories for existing portfolio items
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
      message: 'Storage policies applied successfully',
      directoryResults,
      portfolioItemsProcessed: portfolioItems?.length || 0
    })

  } catch (error) {
    console.error('Storage policies application error:', error)
    return NextResponse.json({
      error: 'Failed to apply storage policies',
      details: String(error)
    }, { status: 500 })
  }
} 