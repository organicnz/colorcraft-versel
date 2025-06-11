#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function testTeamData() {
  console.log('🧪 Testing team data connection...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
  }
  
  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    console.log('📊 Fetching all team members...');
    
    // Test basic table access
    const { data: allTeam, error: allError } = await supabase
      .from('team')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (allError) {
      console.error('❌ Error fetching all team members:', allError);
      return;
    }
    
    console.log(`✅ Found ${allTeam.length} total team members`);
    allTeam.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.full_name} (${member.position}) - Featured: ${member.is_featured}`);
    });
    
    // Test featured members specifically
    console.log('\n🌟 Fetching featured team members...');
    
    const { data: featuredTeam, error: featuredError } = await supabase
      .from('team')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (featuredError) {
      console.error('❌ Error fetching featured team members:', featuredError);
      return;
    }
    
    console.log(`✅ Found ${featuredTeam.length} featured team members`);
    featuredTeam.forEach((member, index) => {
      console.log(`  ${index + 1}. ${member.full_name} - ${member.position}`);
      console.log(`     Bio: ${member.bio?.substring(0, 60)}...`);
      console.log(`     Specialties: ${member.specialties?.join(', ')}`);
      console.log(`     Years: ${member.years_experience}`);
      console.log(`     Avatar: ${member.avatar_url ? 'Yes' : 'No'}`);
      console.log('');
    });
    
    // Test with anon key (what the frontend uses)
    console.log('🔑 Testing with anon key (frontend access)...');
    
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data: anonTeam, error: anonError } = await anonSupabase
      .from('team')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (anonError) {
      console.error('❌ Error with anon key access:', anonError);
      console.log('💡 This might be why the frontend is showing fallback data');
    } else {
      console.log(`✅ Anon key access works! Found ${anonTeam.length} featured members`);
    }
    
    console.log('\n🎉 Team data test completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testTeamData(); 