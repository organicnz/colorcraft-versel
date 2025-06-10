-- ================================================================
-- COLORCRAFT CHAT SYSTEM MIGRATION
-- Copy this ENTIRE file and paste into Supabase SQL Editor
-- ================================================================

-- Clean slate: Drop existing tables if they exist
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_participants CASCADE;
DROP TABLE IF EXISTS public.chat_conversations CASCADE;

-- Create chat conversations table
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

-- Create chat participants table
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

-- Create chat messages table
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

-- Create performance indexes
CREATE INDEX idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX idx_chat_conversations_updated_at ON public.chat_conversations(updated_at DESC);
CREATE INDEX idx_chat_conversations_assigned_admin ON public.chat_conversations(assigned_admin_id);
CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX idx_chat_participants_conversation_id ON public.chat_participants(conversation_id);
CREATE INDEX idx_chat_participants_user_id ON public.chat_participants(user_id);

-- Enable Row Level Security
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Admins can view all conversations" ON public.chat_conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can view their conversations" ON public.chat_conversations
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

-- RLS Policies for participants
CREATE POLICY "Participants can view their participation" ON public.chat_participants
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Anyone can join conversations" ON public.chat_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their participation" ON public.chat_participants
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Participants can view messages" ON public.chat_messages
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

CREATE POLICY "Participants can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_participants 
      WHERE chat_participants.conversation_id = chat_messages.conversation_id 
      AND chat_participants.user_id = auth.uid()
    ) OR sender_id = auth.uid()
  );

-- Create trigger functions
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

CREATE OR REPLACE FUNCTION update_participant_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_participants 
  SET last_seen_at = now()
  WHERE conversation_id = NEW.conversation_id AND user_id = auth.uid();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE PROCEDURE update_conversation_timestamp();

CREATE TRIGGER update_last_seen_on_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE PROCEDURE update_participant_last_seen();

-- Add table comments
COMMENT ON TABLE public.chat_conversations IS 'Stores chat conversation metadata';
COMMENT ON TABLE public.chat_participants IS 'Tracks users participating in conversations';
COMMENT ON TABLE public.chat_messages IS 'Stores individual chat messages';

-- ================================================================
-- MIGRATION COMPLETE! 
-- After running this, your chat system will be ready to use.
-- ================================================================ 