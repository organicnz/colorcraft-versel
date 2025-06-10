#!/usr/bin/env node

/**
 * Chat System Setup Script
 * This script sets up the chat system tables in Supabase
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const setupSQL = `
-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_participants CASCADE;
DROP TABLE IF EXISTS public.chat_conversations CASCADE;

-- Chat conversations table
CREATE TABLE public.chat_conversations (
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
CREATE TABLE public.chat_participants (
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
CREATE TABLE public.chat_messages (
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

-- Indexes for performance
CREATE INDEX idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX idx_chat_conversations_updated_at ON public.chat_conversations(updated_at DESC);
CREATE INDEX idx_chat_conversations_assigned_admin ON public.chat_conversations(assigned_admin_id);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_chat_participants_conversation_id ON public.chat_participants(conversation_id);
CREATE INDEX idx_chat_participants_user_id ON public.chat_participants(user_id);

-- RLS Policies
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Admins can view all conversations" ON public.chat_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view their own conversations" ON public.chat_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants 
      WHERE chat_participants.conversation_id = chat_conversations.id 
      AND chat_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update all conversations" ON public.chat_conversations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Participants policies
CREATE POLICY "Participants can view their own participation" ON public.chat_participants
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Anyone can join conversations" ON public.chat_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own participation" ON public.chat_participants
  FOR UPDATE USING (user_id = auth.uid());

-- Messages policies
CREATE POLICY "Conversation participants can view messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants 
      WHERE chat_participants.conversation_id = chat_messages.conversation_id 
      AND chat_participants.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Conversation participants can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_participants 
      WHERE chat_participants.conversation_id = chat_messages.conversation_id 
      AND chat_participants.user_id = auth.uid()
    ) OR sender_id = auth.uid()
  );

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations 
  SET 
    updated_at = now(),
    last_message_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update conversation timestamp when new message is added
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE PROCEDURE update_conversation_timestamp();

-- Function to update participant last seen
CREATE OR REPLACE FUNCTION update_participant_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_participants 
  SET last_seen_at = now()
  WHERE conversation_id = NEW.conversation_id AND user_id = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update last seen when user sends message
CREATE TRIGGER update_last_seen_on_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE PROCEDURE update_participant_last_seen();

-- Add helpful comments
COMMENT ON TABLE public.chat_conversations IS 'Stores chat conversation metadata';
COMMENT ON TABLE public.chat_participants IS 'Tracks users participating in conversations';
COMMENT ON TABLE public.chat_messages IS 'Stores individual chat messages';
`

async function setupChatSystem() {
  console.log('🚀 Setting up chat system...')
  
  try {
    // Check if tables already exist
    const { data: existingTables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['chat_conversations', 'chat_participants', 'chat_messages'])
    
    if (existingTables && existingTables.length > 0) {
      console.log('⚠️  Chat tables already exist. Dropping and recreating...')
    }

    // Note: We can't execute raw SQL directly through the JS client
    // So we'll provide instructions for manual execution
    console.log('\n📋 MANUAL SETUP REQUIRED:')
    console.log('Since we cannot execute raw SQL through the JavaScript client,')
    console.log('please follow these steps to set up the chat system:\n')
    
    console.log('1. Open your Supabase project dashboard')
    console.log('2. Navigate to the SQL Editor')
    console.log('3. Copy and paste the following SQL:\n')
    console.log('--- SQL START ---')
    console.log(setupSQL)
    console.log('--- SQL END ---\n')
    console.log('4. Execute the SQL')
    console.log('5. Run this script again to verify the setup\n')

    // Try to verify if tables exist by querying them
    try {
      const { data: testConversations, error: convError } = await supabase
        .from('chat_conversations')
        .select('id')
        .limit(1)

      const { data: testParticipants, error: partError } = await supabase
        .from('chat_participants')
        .select('id')
        .limit(1)

      const { data: testMessages, error: msgError } = await supabase
        .from('chat_messages')
        .select('id')
        .limit(1)

      if (!convError && !partError && !msgError) {
        console.log('✅ Chat system tables verified successfully!')
        console.log('✅ Setup complete! The chat widget should now work.')
        return
      }
    } catch (error) {
      // Tables don't exist yet
    }

    console.log('❌ Chat tables not found. Please run the SQL migration manually.')
    console.log('\nAlternatively, you can save the SQL to a file and run it:')
    console.log('node scripts/setup-chat-system.js > migration.sql')
    
  } catch (error) {
    console.error('❌ Error setting up chat system:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  setupChatSystem()
}

module.exports = { setupChatSystem, setupSQL } 