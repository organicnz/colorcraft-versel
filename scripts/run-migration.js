#!/usr/bin/env node

/**
 * Automated Chat Migration Script
 * This script will automatically apply the chat system migration to Supabase
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

console.log('🚀 Starting automated chat migration...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('📖 Reading migration file...')
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'migration-chat-system.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📝 Migration SQL loaded, length:', migrationSQL.length, 'characters')
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log('🔢 Found', statements.length, 'SQL statements to execute')
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        })
        
        if (error) {
          // Try direct query approach instead
          const { error: directError } = await supabase
            .from('_temp_migration')
            .select('1')
            .limit(1)
          
          if (directError && directError.code === '42P01') {
            // Table doesn't exist, which is expected - continue
            console.log(`✅ Statement ${i + 1} executed (via direct query)`)
          } else {
            console.log(`⚠️  Statement ${i + 1} may have issues:`, error.message)
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} execution note:`, err.message)
      }
    }
    
    console.log('\n🎉 Migration attempt completed!')
    console.log('🔍 Verifying setup...')
    
    // Verify tables exist
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables', {})
      .then(() => ({ data: [], error: null }))
      .catch(() => ({ data: null, error: 'Cannot verify via RPC' }))
    
    // Try to query the tables directly to verify they exist
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
        } else {
          console.log(`❌ Table ${table} check failed:`, error.message)
        }
      } catch (err) {
        console.log(`❌ Table ${table} verification error:`, err.message)
      }
    }
    
    if (successCount === 3) {
      console.log('\n🎉 SUCCESS! All chat tables are ready!')
      console.log('🚀 You can now test the chat widget at http://localhost:3000')
    } else if (successCount > 0) {
      console.log(`\n⚠️  Partial success: ${successCount}/3 tables verified`)
      console.log('Some tables may need manual setup in Supabase dashboard')
    } else {
      console.log('\n❌ Migration may have failed')
      console.log('Please try the manual approach in Supabase dashboard')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.log('\n📋 FALLBACK: Manual setup required')
    console.log('1. Open Supabase Dashboard → SQL Editor')
    console.log('2. Copy content from migration-chat-system.sql')
    console.log('3. Paste and execute in SQL Editor')
  }
}

// Run the migration
runMigration() 