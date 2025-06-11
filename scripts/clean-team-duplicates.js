#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function cleanTeamDuplicates() {
  console.log('🧹 Cleaning duplicate team members...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Get all team members
    const { data: allMembers, error: fetchError } = await supabase
      .from('team')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (fetchError) {
      console.error('❌ Error fetching team members:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${allMembers.length} total team members`);
    
    // Group by name to find duplicates
    const membersByName = new Map();
    
    allMembers.forEach(member => {
      const key = member.full_name.toLowerCase().trim();
      if (!membersByName.has(key)) {
        membersByName.set(key, []);
      }
      membersByName.get(key).push(member);
    });
    
    // Find duplicates and keep only the most recent one
    const toDelete = [];
    
    for (const [name, members] of membersByName) {
      if (members.length > 1) {
        console.log(`🔍 Found ${members.length} duplicates for "${name}"`);
        
        // Sort by created_at and keep the most recent
        members.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const toKeep = members[0];
        const duplicates = members.slice(1);
        
        console.log(`  ✅ Keeping: ${toKeep.id} (${toKeep.created_at})`);
        duplicates.forEach(dup => {
          console.log(`  🗑️  Deleting: ${dup.id} (${dup.created_at})`);
          toDelete.push(dup.id);
        });
      }
    }
    
    if (toDelete.length > 0) {
      console.log(`\n🗑️  Deleting ${toDelete.length} duplicate records...`);
      
      const { error: deleteError } = await supabase
        .from('team')
        .delete()
        .in('id', toDelete);
      
      if (deleteError) {
        console.error('❌ Error deleting duplicates:', deleteError);
      } else {
        console.log('✅ Successfully deleted duplicates!');
      }
    } else {
      console.log('✅ No duplicates found!');
    }
    
    // Show final count
    const { data: finalMembers, error: finalError } = await supabase
      .from('team')
      .select('*');
    
    if (!finalError) {
      console.log(`\n📊 Final count: ${finalMembers.length} team members`);
      
      const featured = finalMembers.filter(m => m.is_featured && m.is_active);
      console.log(`🌟 Featured members: ${featured.length}`);
      
      featured.forEach((member, i) => {
        console.log(`  ${i + 1}. ${member.full_name} - ${member.position}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

cleanTeamDuplicates(); 