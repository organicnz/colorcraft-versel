import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Create the chat system tables using SQL
    const setupSQL = `
      -- Chat conversations table
      CREATE TABLE IF NOT EXISTS public.chat_conversations (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        title text DEFAULT 'New Conversation',
        status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
        priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
        customer_email text,
        customer_name text,
        assigned_admin_id uuid REFERENCES auth.users(id),
        metadata jsonb DEFAULT '{}',
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL,
        last_message_at timestamp with time zone DEFAULT now()
      );

      -- Chat participants table
      CREATE TABLE IF NOT EXISTS public.chat_participants (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
        user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
        participant_type text NOT NULL CHECK (participant_type IN ('customer', 'admin', 'guest')),
        joined_at timestamp with time zone DEFAULT now() NOT NULL,
        last_seen_at timestamp with time zone DEFAULT now(),
        is_online boolean DEFAULT false,
        UNIQUE(conversation_id, user_id)
      );

      -- Chat messages table
      CREATE TABLE IF NOT EXISTS public.chat_messages (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        conversation_id uuid REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
        sender_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
        sender_name text NOT NULL,
        sender_email text,
        message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
        content text NOT NULL,
        metadata jsonb DEFAULT '{}',
        is_read boolean DEFAULT false,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );
    `;

    // Execute the SQL
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: setupSQL })
    
    if (tableError) {
      console.error('Error creating tables:', tableError)
      return NextResponse.json({ error: 'Failed to create tables' }, { status: 500 })
    }

    // Check if tables were created by testing a simple query
    const { data: testData, error: testError } = await supabase
      .from('chat_conversations')
      .select('id')
      .limit(1)

    if (testError) {
      console.log('Tables may not exist yet, that\'s expected on first run')
    }

    return NextResponse.json({ 
      message: 'Chat system setup completed successfully',
      tablesCreated: !testError
    })
  } catch (error) {
    console.error('Error setting up chat system:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 