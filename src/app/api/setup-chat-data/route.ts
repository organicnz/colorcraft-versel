import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Setting up chat system...')

    // Create admin client with service role key
    const adminSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('📝 Creating sample conversations...')

    // Create sample conversations directly
    const sampleConversations = [
      {
        title: 'Cabinet Refinishing Inquiry',
        status: 'active',
        priority: 'normal',
        customer_email: 'sarah.johnson@email.com',
        customer_name: 'Sarah Johnson',
        metadata: { source: 'website_form' }
      },
      {
        title: 'Dining Table Restoration',
        status: 'active', 
        priority: 'high',
        customer_email: 'mike.davis@email.com',
        customer_name: 'Mike Davis',
        metadata: { source: 'phone_call' }
      },
      {
        title: 'Antique Dresser Project',
        status: 'closed',
        priority: 'normal',
        customer_email: 'emma.wilson@email.com',
        customer_name: 'Emma Wilson',
        metadata: { source: 'referral' }
      },
      {
        title: 'Kitchen Chair Set',
        status: 'active',
        priority: 'low',
        customer_email: 'james.brown@email.com',
        customer_name: 'James Brown',
        metadata: { source: 'website_form' }
      }
    ]

    const { data: conversations, error: convError } = await adminSupabase
      .from('chat_conversations')
      .insert(sampleConversations)
      .select()

    if (convError) {
      console.error('❌ Error creating conversations:', convError)
      return NextResponse.json({
        success: false,
        error: `Failed to create conversations: ${convError.message}`,
        details: convError
      }, { status: 500 })
    } else {
      console.log('✅ Created conversations:', conversations?.length)
    }

    // Create sample messages for each conversation
    if (conversations && conversations.length > 0) {
      const sampleMessages = []
      
      for (const conv of conversations) {
        const baseTime = Date.now()
        sampleMessages.push(
          {
            conversation_id: conv.id,
            sender_name: conv.customer_name,
            sender_email: conv.customer_email,
            content: `Hi, I'm interested in getting my ${conv.title.toLowerCase().replace(' inquiry', '').replace(' restoration', '').replace(' project', '')} done. Could you provide more information about your services?`,
            message_type: 'text',
            created_at: new Date(baseTime - Math.random() * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            conversation_id: conv.id,
            sender_name: 'ColorCraft Support',
            sender_email: 'support@colorcraft.com',
            content: `Hello ${conv.customer_name}! Thank you for your interest. We'd be happy to help with your project. Could you share some photos and details about the current condition?`,
            message_type: 'text',
            created_at: new Date(baseTime - Math.random() * 12 * 60 * 60 * 1000).toISOString()
          }
        )
      }

      const { data: messages, error: msgError } = await adminSupabase
        .from('chat_messages')
        .insert(sampleMessages)
        .select()

      if (msgError) {
        console.error('❌ Error creating messages:', msgError)
      } else {
        console.log('✅ Created messages:', messages?.length)
      }
    }

    // Test data retrieval
    const { data: testConversations, error: testError } = await adminSupabase
      .from('chat_conversations')
      .select(`
        *,
        chat_messages (
          id,
          content,
          created_at
        )
      `)
      .limit(5)

    console.log('🔍 Test query result:', { 
      count: testConversations?.length || 0, 
      error: testError?.message 
    })

    return NextResponse.json({
      success: true,
      message: 'Chat system setup completed successfully',
      data: {
        conversations_created: conversations?.length || 0,
        conversations_found: testConversations?.length || 0,
        sample_data: testConversations
      }
    })

  } catch (error: any) {
    console.error('❌ Setup error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 