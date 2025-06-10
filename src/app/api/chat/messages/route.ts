import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NewChatMessage } from '@/types/chat'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 })
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
      .select(`
        *,
        sender:users(full_name, email)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

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
    console.error('Error fetching messages:', error)
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
    const { conversation_id, content, message_type = 'text' } = body

    if (!conversation_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user is admin or participant
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

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
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id,
        sender_id: session.user.id,
        sender_type: user?.role === 'admin' ? 'admin' : 'customer',
        message_type,
        content,
        is_read: false
      })
      .select(`
        *,
        sender:users(full_name, email)
      `)
      .single()

    if (error) {
      throw error
    }

    // Update conversation last_message_at
    await supabase
      .from('chat_conversations')
      .update({ 
        last_message_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', conversation_id)

    // Update participant last_seen
    await supabase
      .from('chat_participants')
      .update({ last_seen: new Date().toISOString() })
      .eq('conversation_id', conversation_id)
      .eq('user_id', session.user.id)

    return NextResponse.json({
      success: true,
      message
    })

  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 