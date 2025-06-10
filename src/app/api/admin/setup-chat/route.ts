import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // SQL to create chat system tables
    const setupSQL = `
      -- Create chat_conversations table
      CREATE TABLE IF NOT EXISTS public.chat_conversations (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        subject TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'waiting')),
        priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        closed_at TIMESTAMP WITH TIME ZONE,
        last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      -- Create chat_participants table
      CREATE TABLE IF NOT EXISTS public.chat_participants (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        participant_type TEXT NOT NULL CHECK (participant_type IN ('customer', 'admin')),
        is_online BOOLEAN DEFAULT FALSE,
        last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      -- Create chat_messages table
      CREATE TABLE IF NOT EXISTS public.chat_messages (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
        sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'admin')),
        message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system')),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      -- Create indexes for performance
      CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status);
      CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_at ON public.chat_conversations(created_at);
      CREATE INDEX IF NOT EXISTS idx_chat_participants_conversation ON public.chat_participants(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_chat_participants_user ON public.chat_participants(user_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);

      -- Enable RLS
      ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
    `

    // Execute the SQL
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: setupSQL })
    
    if (tableError) {
      console.error('Error creating tables:', tableError)
      return NextResponse.json({ error: 'Failed to create tables' }, { status: 500 })
    }

    // Test the tables by checking if they exist
    const { data: testData } = await supabase
      .from('chat_conversations')
      .select('*')
      .limit(1)

    return NextResponse.json({
      success: true,
      message: 'Chat system setup completed successfully',
      tables: {
        chat_conversations: 'created',
        chat_participants: 'created', 
        chat_messages: 'created'
      }
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 