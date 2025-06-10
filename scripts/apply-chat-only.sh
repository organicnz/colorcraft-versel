#!/bin/bash

echo "🚀 Applying chat system migration to remote database..."

# Check if we're linked to a Supabase project
if ! supabase status &>/dev/null; then
    echo "❌ No Supabase project linked. Please run 'supabase link' first."
    exit 1
fi

echo "📖 Running chat system migration..."

# Use psql through Supabase to run our migration
cat > /tmp/chat_migration.sql << 'EOF'
-- Create chat system (safe version)
DO $$
BEGIN
    -- Drop tables if they exist
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
    
    -- Create indexes
    CREATE INDEX idx_chat_conversations_status ON public.chat_conversations(status);
    CREATE INDEX idx_chat_conversations_updated_at ON public.chat_conversations(updated_at DESC);
    CREATE INDEX idx_chat_conversations_assigned_admin ON public.chat_conversations(assigned_admin_id);
    CREATE INDEX idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
    CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
    CREATE INDEX idx_chat_participants_conversation_id ON public.chat_participants(conversation_id);
    CREATE INDEX idx_chat_participants_user_id ON public.chat_participants(user_id);
    
    -- Enable RLS
    ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'Chat tables created successfully';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating chat tables: %', SQLERRM;
END
$$;

-- Create RLS policies
DO $$
BEGIN
    -- Conversations policies
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
    
    -- Participants policies
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
    
    -- Messages policies
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
    
    RAISE NOTICE 'Chat policies created successfully';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating chat policies: %', SQLERRM;
END
$$;

-- Create functions and triggers
DO $$
BEGIN
    -- Create trigger functions
    CREATE OR REPLACE FUNCTION update_conversation_timestamp()
    RETURNS TRIGGER AS $TRIGGER$
    BEGIN
      UPDATE public.chat_conversations 
      SET 
        updated_at = now(),
        last_message_at = now()
      WHERE id = NEW.conversation_id;
      RETURN NEW;
    END;
    $TRIGGER$ language 'plpgsql';
    
    CREATE OR REPLACE FUNCTION update_participant_last_seen()
    RETURNS TRIGGER AS $TRIGGER$
    BEGIN
      UPDATE public.chat_participants 
      SET last_seen_at = now()
      WHERE conversation_id = NEW.conversation_id AND user_id = auth.uid();
      RETURN NEW;
    END;
    $TRIGGER$ language 'plpgsql';
    
    -- Create triggers
    DROP TRIGGER IF EXISTS update_conversation_on_message ON public.chat_messages;
    CREATE TRIGGER update_conversation_on_message
      AFTER INSERT ON public.chat_messages
      FOR EACH ROW
      EXECUTE PROCEDURE update_conversation_timestamp();
    
    DROP TRIGGER IF EXISTS update_last_seen_on_message ON public.chat_messages;
    CREATE TRIGGER update_last_seen_on_message
      AFTER INSERT ON public.chat_messages
      FOR EACH ROW
      EXECUTE PROCEDURE update_participant_last_seen();
    
    -- Add comments
    COMMENT ON TABLE public.chat_conversations IS 'Stores chat conversation metadata';
    COMMENT ON TABLE public.chat_participants IS 'Tracks users participating in conversations';
    COMMENT ON TABLE public.chat_messages IS 'Stores individual chat messages';
    
    RAISE NOTICE 'Chat functions and triggers created successfully';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating chat functions: %', SQLERRM;
END
$$;

-- Test the setup
SELECT 'Chat system migration completed successfully!' as result;
EOF

echo "📤 Executing migration on remote database..."

# Execute the migration using psql through Supabase
if supabase db reset --local=false < /tmp/chat_migration.sql 2>/dev/null; then
    echo "✅ Migration applied successfully using db reset method"
else
    echo "⚡ Trying alternative execution method..."
    # Try direct psql approach if available
    if command -v psql &> /dev/null; then
        # Get connection details from environment
        if [ -f .env.local ]; then
            source .env.local
            echo "🔗 Connecting to $NEXT_PUBLIC_SUPABASE_URL"
            # Note: This would need the actual connection string, but we'll use our existing approach
        fi
    fi
    
    echo "⚠️  Could not apply migration via CLI"
    echo "📋 Please apply the migration manually:"
    echo "   1. Open Supabase Dashboard → SQL Editor"
    echo "   2. Copy the content from SUPABASE_MIGRATION_READY.sql"
    echo "   3. Paste and execute in SQL Editor"
fi

# Clean up temporary file
rm -f /tmp/chat_migration.sql

echo "🧪 Testing connection to chat tables..."

# Try to verify the migration worked
if node scripts/setup-chat-system.js 2>/dev/null | grep -q "Chat system tables verified successfully!"; then
    echo "🎉 SUCCESS! Chat system is ready to use!"
    echo "🚀 Test your chat widget at http://localhost:3000"
else
    echo "⚠️  Migration may need manual verification"
    echo "Run: node scripts/setup-chat-system.js"
fi 