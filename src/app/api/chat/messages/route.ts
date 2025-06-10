import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NewChatMessage } from '@/types/chat'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversation_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    if (!conversationId) {
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })
    }

    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this conversation
    const { data: participant } = await supabase
      .from('chat_participants')
      .select('*')
      .eq('conversation_id', conversationId)
      .eq('user_id', session.user.id)
      .single()

    // Also check if user is admin
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
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mark messages as read for current user
    if (participant) {
      await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', session.user.id)
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error in GET /api/chat/messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: NewChatMessage = await request.json()
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user details
    const { data: user } = await supabase
      .from('users')
      .select('full_name, email, role')
      .eq('id', session.user.id)
      .single()

    // Check if user has access to this conversation
    const { data: participant } = await supabase
      .from('chat_participants')
      .select('*')
      .eq('conversation_id', body.conversation_id)
      .eq('user_id', session.user.id)
      .single()

    if (!participant && user?.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Create message
    const { data: message, error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: body.conversation_id,
        sender_id: session.user.id,
        sender_name: user?.full_name || session.user.email || 'Unknown',
        sender_email: user?.email || session.user.email,
        message_type: body.message_type || 'text',
        content: body.content,
        metadata: body.metadata || {}
      })
      .select()
      .single()

    if (messageError) {
      console.error('Error creating message:', messageError)
      return NextResponse.json({ error: messageError.message }, { status: 500 })
    }

    // Update participant last seen
    await supabase
      .from('chat_participants')
      .update({ 
        last_seen_at: new Date().toISOString(),
        is_online: true 
      })
      .eq('conversation_id', body.conversation_id)
      .eq('user_id', session.user.id)

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error in POST /api/chat/messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 