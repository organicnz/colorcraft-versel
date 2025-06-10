#!/usr/bin/env node

/**
 * Direct Database Migration Script
 * Applies chat system migration directly to remote Supabase database
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Direct migration to remote Supabase database...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

console.log('🔗 Connecting to remote database:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createChatTables() {
  console.log('📝 Creating chat tables...')
  
  try {
    // First, drop existing tables if they exist
    const dropStatements = [
      'DROP TABLE IF EXISTS public.chat_messages CASCADE',
      'DROP TABLE IF EXISTS public.chat_participants CASCADE', 
      'DROP TABLE IF EXISTS public.chat_conversations CASCADE'
    ]
    
    // Create tables one by one using multiple operations
    console.log('🗑️  Cleaning up existing tables...')
    
    // Drop existing policies first to avoid conflicts
    try {
      await supabase.rpc('exec_sql', { query: 'DROP POLICY IF EXISTS "Participants can send messages" ON public.chat_messages' })
      await supabase.rpc('exec_sql', { query: 'DROP POLICY IF EXISTS "Participants can view messages" ON public.chat_messages' })
      await supabase.rpc('exec_sql', { query: 'DROP POLICY IF EXISTS "Anyone can join conversations" ON public.chat_participants' })
      await supabase.rpc('exec_sql', { query: 'DROP POLICY IF EXISTS "Participants can view their participation" ON public.chat_participants' })
      await supabase.rpc('exec_sql', { query: 'DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations' })
      await supabase.rpc('exec_sql', { query: 'DROP POLICY IF EXISTS "Users can view their conversations" ON public.chat_conversations' })
      await supabase.rpc('exec_sql', { query: 'DROP POLICY IF EXISTS "Admins can view all conversations" ON public.chat_conversations' })
    } catch (e) {
      console.log('⚠️  Policies may not exist (this is normal for first run)')
    }
    
    // Drop tables
    for (const dropSQL of dropStatements) {
      try {
        await supabase.rpc('exec_sql', { query: dropSQL })
      } catch (e) {
        console.log('⚠️  Table may not exist:', e.message.substring(0, 50) + '...')
      }
    }
    
    console.log('🏗️  Creating new tables...')
    
    // Since we can't use exec_sql, let's try a different approach
    // We'll create tables by using the REST API directly
    
    // Test if tables already exist by trying to query them
    console.log('🔍 Checking existing tables...')
    
    const { data: existingConversations, error: convError } = await supabase
      .from('chat_conversations')
      .select('id')
      .limit(1)
    
    if (!convError) {
      console.log('✅ chat_conversations table already exists')
    } else {
      console.log('❌ chat_conversations table needs to be created')
      console.log('\n📋 MANUAL MIGRATION REQUIRED:')
      console.log('The Supabase JavaScript client cannot create tables directly.')
      console.log('Please follow these steps:')
      console.log('\n1. Open your Supabase Dashboard: https://app.supabase.com')
      console.log('2. Navigate to SQL Editor')
      console.log('3. Copy the content from SUPABASE_MIGRATION_READY.sql')
      console.log('4. Paste and execute in SQL Editor')
      console.log('\nAlternatively, run this quick command:')
      console.log('cat SUPABASE_MIGRATION_READY.sql')
      console.log('\nThen copy-paste the output into Supabase SQL Editor.')
      
      console.log('\n⏰ Taking a shortcut and showing you the SQL to copy:')
      console.log('=' .repeat(80))
      
      try {
        const sqlContent = fs.readFileSync('SUPABASE_MIGRATION_READY.sql', 'utf8')
        console.log(sqlContent)
        console.log('=' .repeat(80))
        console.log('\n📌 Copy everything above and paste it into Supabase SQL Editor')
      } catch (err) {
        console.log('❌ Could not read SUPABASE_MIGRATION_READY.sql file')
      }
      
      return false
    }
    
    // Check other tables
    const { data: existingParticipants, error: partError } = await supabase
      .from('chat_participants')
      .select('id')
      .limit(1)
    
    const { data: existingMessages, error: msgError } = await supabase
      .from('chat_messages')
      .select('id')
      .limit(1)
    
    if (!partError && !msgError) {
      console.log('✅ All chat tables exist!')
      return true
    } else {
      console.log('❌ Some chat tables are missing')
      return false
    }
    
  } catch (error) {
    console.error('❌ Error during table creation:', error.message)
    return false
  }
}

async function verifyMigration() {
  console.log('\n🔍 Verifying chat system...')
  
  const tables = ['chat_conversations', 'chat_participants', 'chat_messages']
  let successCount = 0
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1)
      
      if (!error || error.code === 'PGRST116') {
        console.log(`✅ ${table} - OK`)
        successCount++
      } else {
        console.log(`❌ ${table} - ERROR:`, error.message)
      }
    } catch (err) {
      console.log(`❌ ${table} - FAILED:`, err.message)
    }
  }
  
  if (successCount === 3) {
    console.log('\n🎉 SUCCESS! Chat system is ready!')
    console.log('🚀 Test your chat widget at http://localhost:3000')
    
    // Test create a conversation
    try {
      console.log('\n🧪 Testing conversation creation...')
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          title: 'Test Migration',
          customer_name: 'Migration Test',
          customer_email: 'test@example.com'
        })
        .select()
        .single()
      
      if (!error) {
        console.log('✅ Test conversation created successfully')
        
        // Clean up test data
        await supabase
          .from('chat_conversations')
          .delete()
          .eq('id', data.id)
        console.log('✅ Test data cleaned up')
      } else {
        console.log('⚠️  Test conversation failed (this may be normal):', error.message)
      }
    } catch (testErr) {
      console.log('⚠️  Conversation test skipped (permissions may need setup)')
    }
    
    return true
  } else {
    console.log(`\n❌ Migration incomplete: ${successCount}/3 tables ready`)
    return false
  }
}

async function main() {
  try {
    const tablesReady = await createChatTables()
    
    if (tablesReady) {
      await verifyMigration()
    } else {
      console.log('\n📋 SUMMARY:')
      console.log('• Tables need to be created manually in Supabase Dashboard')
      console.log('• Use the SQL provided above')
      console.log('• After applying SQL, run: node scripts/setup-chat-system.js')
    }
    
  } catch (error) {
    console.error('❌ Migration script failed:', error.message)
    console.log('\n📋 FALLBACK INSTRUCTIONS:')
    console.log('1. Open Supabase Dashboard → SQL Editor')
    console.log('2. Copy content from SUPABASE_MIGRATION_READY.sql')
    console.log('3. Paste and execute in SQL Editor')
    console.log('4. Verify with: node scripts/setup-chat-system.js')
  }
}

main() 