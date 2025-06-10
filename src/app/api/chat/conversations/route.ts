import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NewChatConversation } from '@/types/chat'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user
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

    let query = supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_messages(
          id,
          content,
          sender_name,
          message_type,
          created_at
        )
      `)

    // If not admin, only show conversations user is participating in
    if (user?.role !== 'admin') {
      query = query
        .eq('chat_participants.user_id', session.user.id)
        .neq('status', 'archived')
    }

    const { data: conversations, error } = await query
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process conversations to add unread count and last message
    const processedConversations = conversations?.map(conv => {
      const messages = conv.chat_messages || []
      const lastMessage = messages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]
      
      return {
        ...conv,
        last_message: lastMessage,
        unread_count: messages.filter(m => !m.is_read).length,
        chat_messages: undefined // Remove to avoid confusion
      }
    })

    return NextResponse.json({ conversations: processedConversations })
  } catch (error) {
    console.error('Error in GET /api/chat/conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: NewChatConversation = await request.json()
    
    // Get current user or allow anonymous users
    const { data: { session } } = await supabase.auth.getSession()
    
    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('chat_conversations')
      .insert({
        title: body.title || 'New Conversation',
        customer_email: body.customer_email || session?.user?.email,
        customer_name: body.customer_name || session?.user?.user_metadata?.full_name,
        priority: body.priority || 'normal',
        metadata: body.metadata || {}
      })
      .select()
      .single()

    if (convError) {
      console.error('Error creating conversation:', convError)
      return NextResponse.json({ error: convError.message }, { status: 500 })
    }

    // Add participant
    if (session?.user?.id) {
      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert({
          conversation_id: conversation.id,
          user_id: session.user.id,
          participant_type: session?.user?.user_metadata?.role === 'admin' ? 'admin' : 'customer'
        })

      if (participantError) {
        console.error('Error adding participant:', participantError)
      }
    }

    // Send welcome message
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        sender_name: 'System',
        message_type: 'system',
        content: 'Welcome! How can we help you today?',
        metadata: { type: 'welcome' }
      })

    if (messageError) {
      console.error('Error sending welcome message:', messageError)
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error('Error in POST /api/chat/conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 