import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NewChatMessage } from '@/types/chat'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversation_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    console.log('🔍 Fetching messages for conversation:', conversationId)

    if (!conversationId) {
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })
    }

    // Check if user is authenticated
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify user has access to this conversation
    const { data: participant } = await supabase
      .from('chat_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', session.user.id)
      .single()

    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!participant && user?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Fetch messages
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('❌ Error fetching messages:', error)
      throw error
    }

    console.log('✅ Messages fetched:', messages?.length || 0)

    // Mark messages as read if user is participant
    if (participant) {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', session.user.id)
    }

    return NextResponse.json({
      messages: messages || [],
      pagination: {
        page,
        limit,
        total: messages?.length || 0
      }
    })

  } catch (error) {
    console.error('💥 Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Creating new message...')

    // Check if user is authenticated
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('📝 Message data:', body)

    const { conversation_id, content, message_type = 'text' } = body

    if (!conversation_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user information
    const { data: user } = await supabase
      .from('users')
      .select('role, full_name, email')
      .eq('id', session.user.id)
      .single()

    console.log('👤 User info:', user)

    // Check if user is admin or participant
    const { data: participant } = await supabase
      .from('chat_participants')
      .select('*')
      .eq('conversation_id', conversation_id)
      .eq('user_id', session.user.id)
      .single()

    if (!participant && user?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create message
    console.log('🔄 Inserting message into database...')
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id,
        sender_id: session.user.id,
        sender_name: user?.full_name || session.user.email || 'Unknown User',
        sender_email: user?.email || session.user.email,
        message_type,
        content,
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating message:', error)
      throw error
    }

    console.log('✅ Message created:', message.id)

    // Update conversation last_message_at
    await supabase
      .from('chat_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', conversation_id)

    // Update participant last_seen_at
    await supabase
      .from('chat_participants')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('conversation_id', conversation_id)
      .eq('user_id', session.user.id)

    console.log('🎉 Message successfully created!')

    return NextResponse.json({
      success: true,
      message
    })

  } catch (error) {
    console.error('💥 Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 