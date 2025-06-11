import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
      tables_exist: {},
      counts: {},
      sample_data: {},
      auth_info: {
        user_id: session.user.id,
        email: session.user.email
      }
    }

    // Check if chat tables exist
    try {
      const { data: conversations, error: convError } = await supabase
        .from('chat_conversations')
        .select('*')
        .limit(1)
      
      results.tables_exist.chat_conversations = !convError
      if (convError) results.tables_exist.conv_error = convError.message
    } catch (error: any) {
      results.tables_exist.chat_conversations = false
      results.tables_exist.conv_error = error.message
    }

    try {
      const { data: participants, error: partError } = await supabase
        .from('chat_participants')
        .select('*')
        .limit(1)
      
      results.tables_exist.chat_participants = !partError
      if (partError) results.tables_exist.part_error = partError.message
    } catch (error: any) {
      results.tables_exist.chat_participants = false
      results.tables_exist.part_error = error.message
    }

    try {
      const { data: messages, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .limit(1)
      
      results.tables_exist.chat_messages = !msgError
      if (msgError) results.tables_exist.msg_error = msgError.message
    } catch (error: any) {
      results.tables_exist.chat_messages = false
      results.tables_exist.msg_error = error.message
    }

    // Get counts if tables exist
    if (results.tables_exist.chat_conversations) {
      const { count } = await supabase
        .from('chat_conversations')
        .select('*', { count: 'exact', head: true })
      results.counts.conversations = count
    }

    if (results.tables_exist.chat_participants) {
      const { count } = await supabase
        .from('chat_participants')
        .select('*', { count: 'exact', head: true })
      results.counts.participants = count
    }

    if (results.tables_exist.chat_messages) {
      const { count } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
      results.counts.messages = count
    }

    // Try to get sample data
    if (results.tables_exist.chat_conversations) {
      const { data: sampleConversations } = await supabase
        .from('chat_conversations')
        .select('*')
        .limit(3)
      results.sample_data.conversations = sampleConversations
    }

    return NextResponse.json(results)

  } catch (error: any) {
    console.error('Chat test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
} 