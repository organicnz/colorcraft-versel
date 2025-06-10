import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NewChatConversation } from '@/types/chat'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (only admins can see all conversations)
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const { data: conversations } = await supabase
      .from('chat_conversations')
      .select(`
        *,
        chat_participants (
          *,
          users (
            full_name,
            email
          )
        ),
        chat_messages (
          id,
          content,
          created_at,
          is_read,
          sender_type
        )
      `)
      .order('last_message_at', { ascending: false })

    // Process conversations to add derived data
    const processedConversations = conversations?.map((conv: any) => {
      const messages = conv.chat_messages || []
      const lastMessage = messages.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]

      return {
        ...conv,
        last_message: lastMessage || null,
        unread_count: messages.filter((m: any) => !m.is_read).length,
        participant_count: conv.chat_participants?.length || 0
      }
    })

    return NextResponse.json({
      conversations: processedConversations || [],
      total: processedConversations?.length || 0
    })

  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customer_name, customer_email, subject } = body

    if (!customer_name || !customer_email || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('chat_conversations')
      .insert({
        customer_name,
        customer_email,
        subject,
        status: 'active',
        priority: 'normal'
      })
      .select()
      .single()

    if (convError) {
      throw convError
    }

    // Add participant
    if (conversation) {
      await supabase
        .from('chat_participants')
        .insert({
          conversation_id: conversation.id,
          user_id: session.user.id,
          participant_type: 'customer'
        })

      // Create initial system message
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: session.user.id,
          sender_type: 'system',
          message_type: 'system',
          content: `Conversation started by ${customer_name}`,
          is_read: true
        })
    }

    return NextResponse.json({
      success: true,
      conversation
    })

  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 