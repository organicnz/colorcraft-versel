#!/usr/bin/env node

/**
 * Remote Database Migration Script
 * This script applies the chat system migration to your remote Supabase database
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Applying chat migration to REMOTE database...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

console.log('🔗 Connecting to:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQL(sql) {
  try {
    // Use the REST API to execute raw SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      // Try alternative approach using direct SQL execution
      const response2 = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sql',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: sql
      })
      
      if (!response2.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }
      
      return await response2.text()
    }

    return await response.json()
  } catch (error) {
    throw new Error(`SQL execution failed: ${error.message}`)
  }
}

async function applyMigration() {
  try {
    console.log('📖 Reading migration file...')
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'SUPABASE_MIGRATION_READY.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📝 Migration SQL loaded, executing...')
    
    // Execute the entire migration as one block
    try {
      await executeSQL(migrationSQL)
      console.log('✅ Migration executed via SQL endpoint')
    } catch (sqlError) {
      console.log('⚠️  Direct SQL failed, trying table-by-table approach...')
      
      // Split into individual statements and execute one by one
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      console.log(`🔢 Executing ${statements.length} statements individually...`)
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i] + ';'
        try {
          await executeSQL(statement)
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`)
        } catch (stmtError) {
          console.log(`⚠️  Statement ${i + 1}/${statements.length} note: ${stmtError.message}`)
        }
      }
    }
    
    console.log('\n🔍 Verifying migration...')
    
    // Test if tables exist by trying to query them
    const tablesToCheck = ['chat_conversations', 'chat_participants', 'chat_messages']
    let successCount = 0
    
    for (const table of tablesToCheck) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        if (!error) {
          console.log(`✅ Table ${table} exists and is accessible`)
          successCount++
        } else if (error.code === 'PGRST116') {
          console.log(`✅ Table ${table} exists (empty table)`)
          successCount++
        } else {
          console.log(`❌ Table ${table} check failed:`, error.message)
        }
      } catch (err) {
        console.log(`❌ Table ${table} verification error:`, err.message)
      }
    }
    
    if (successCount === 3) {
      console.log('\n🎉 SUCCESS! Chat system migration completed!')
      console.log('🚀 Your chat widget is now ready to use!')
      console.log('📱 Test it at http://localhost:3000')
      
      // Create a test conversation to verify everything works
      console.log('\n🧪 Creating test conversation...')
      try {
        const { data: testConv, error: testError } = await supabase
          .from('chat_conversations')
          .insert({
            title: 'Migration Test',
            customer_name: 'System Test',
            customer_email: 'test@colorcraft.com'
          })
          .select()
          .single()
        
        if (!testError) {
          console.log('✅ Test conversation created successfully!')
          
          // Clean up test data
          await supabase
            .from('chat_conversations')
            .delete()
            .eq('id', testConv.id)
          
          console.log('✅ Test data cleaned up')
        }
      } catch (testErr) {
        console.log('⚠️  Test creation skipped (tables exist but policies may need setup)')
      }
      
    } else if (successCount > 0) {
      console.log(`\n⚠️  Partial success: ${successCount}/3 tables verified`)
      console.log('Some tables may need manual verification in Supabase dashboard')
    } else {
      console.log('\n❌ Migration verification failed')
      console.log('Tables may exist but not be accessible via current permissions')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n📋 TROUBLESHOOTING:')
    console.log('1. Check your SUPABASE_SERVICE_ROLE_KEY in .env.local')
    console.log('2. Ensure your Supabase project allows direct SQL execution')
    console.log('3. Try the manual approach in Supabase Dashboard → SQL Editor')
  }
}

// Execute the migration
applyMigration() 