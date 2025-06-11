#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function createTeamTable() {
  console.log('🚀 Creating team table...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials');
    console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
    process.exit(1);
  }
  
  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  try {
    // Read and execute the migration SQL
    const migrationPath = path.join(__dirname, '..', 'sql', 'migrations', 'create_team_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Executing team table migration...');
    
    // Split the SQL into individual statements and execute them
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      console.log(`⚡ Executing: ${statement.substring(0, 50)}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        console.error('❌ Error executing statement:', error);
        // Continue with other statements
      } else {
        console.log('✅ Statement executed successfully');
      }
    }
    
    // Insert sample team members
    console.log('👥 Inserting sample team members...');
    
    const sampleTeamMembers = [
      {
        full_name: 'Sarah Mitchell',
        position: 'Lead Furniture Artist',
        bio: 'With over 15 years of experience in furniture restoration and custom painting, Sarah leads our creative team with passion and expertise.',
        avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
        email: 'sarah@colorcraft.com',
        phone: '(555) 123-4567',
        years_experience: 15,
        specialties: ['Vintage Revival', 'Custom Painting', 'Chalk Paint'],
        social_links: {
          instagram: '@sarahmitchell_art',
          linkedin: 'sarah-mitchell-artist'
        },
        is_featured: true,
        is_active: true,
        display_order: 1
      },
      {
        full_name: 'James Wilson',
        position: 'Restoration Specialist',
        bio: 'Expert in antique furniture and period-accurate finishes. James brings historical pieces back to life with meticulous attention to detail.',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        email: 'james@colorcraft.com',
        phone: '(555) 123-4568',
        years_experience: 12,
        specialties: ['Antique Restoration', 'Wood Repair', 'Period Finishes'],
        social_links: {
          instagram: '@james_restoration',
          linkedin: 'james-wilson-restoration'
        },
        is_featured: true,
        is_active: true,
        display_order: 2
      },
      {
        full_name: 'Emma Rodriguez',
        position: 'Design Consultant',
        bio: 'Creative visionary specializing in modern upcycling and sustainable design. Emma helps clients transform their vision into reality.',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        email: 'emma@colorcraft.com',
        phone: '(555) 123-4569',
        years_experience: 8,
        specialties: ['Modern Upcycling', 'Design Consultation', 'Sustainable Materials'],
        social_links: {
          instagram: '@emma_designs',
          linkedin: 'emma-rodriguez-design'
        },
        is_featured: true,
        is_active: true,
        display_order: 3
      },
      {
        full_name: 'Michael Chen',
        position: 'Project Manager',
        bio: 'Coordinates all aspects of our furniture transformation projects, ensuring quality results and timely delivery.',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        email: 'michael@colorcraft.com',
        phone: '(555) 123-4570',
        years_experience: 10,
        specialties: ['Project Management', 'Quality Control', 'Client Relations'],
        social_links: {
          linkedin: 'michael-chen-pm'
        },
        is_featured: false,
        is_active: true,
        display_order: 4
      }
    ];
    
    const { data: insertData, error: insertError } = await supabase
      .from('team')
      .insert(sampleTeamMembers)
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting sample data:', insertError);
    } else {
      console.log(`✅ Successfully inserted ${insertData.length} team members`);
    }
    
    // Verify the table was created
    const { data: teamData, error: fetchError } = await supabase
      .from('team')
      .select('*')
      .limit(1);
    
    if (fetchError) {
      console.error('❌ Error verifying table:', fetchError);
    } else {
      console.log('✅ Team table created and verified successfully!');
      console.log(`📊 Team members in database: ${teamData.length > 0 ? 'Found data' : 'No data'}`);
    }
    
    console.log('🎉 Team table setup completed!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating team table:', error);
    process.exit(1);
  }
}

createTeamTable(); 