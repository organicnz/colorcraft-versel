-- Create team table for displaying team members on the website
-- This is separate from users table to allow rich team information

-- Create team table
create table if not exists public.team (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) null, -- Optional link to user account
  full_name text not null,
  position text not null,
  bio text,
  email text, -- Public contact email (can be different from user email)
  phone text,
  avatar_url text,
  years_experience integer,
  specialties text[], -- e.g., ['furniture restoration', 'antique refinishing']
  social_links jsonb default '{}'::jsonb, -- {linkedin: "url", instagram: "url", etc.}
  is_featured boolean default false,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create indexes for performance
create index if not exists team_active_display_order_idx on public.team (is_active, display_order);
create index if not exists team_featured_idx on public.team (is_featured) where is_featured = true;
create index if not exists team_user_id_idx on public.team (user_id) where user_id is not null;

-- Enable RLS
alter table public.team enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Team members are viewable by everyone" on public.team;
drop policy if exists "Only admins can manage team" on public.team;

-- Public read access for team display
create policy "Team members are viewable by everyone"
  on public.team for select
  using (is_active = true);

-- Admin-only write access
create policy "Only admins can manage team"
  on public.team for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
create or replace function public.update_team_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists update_team_updated_at on public.team;
create trigger update_team_updated_at
  before update on public.team
  for each row
  execute function public.update_team_updated_at();

-- Insert sample team data
insert into public.team (
  full_name,
  position,
  bio,
  email,
  specialties,
  social_links,
  is_featured,
  display_order,
  avatar_url
) values 
(
  'Sarah Johnson',
  'Lead Furniture Restoration Specialist',
  'With over 15 years of experience in furniture restoration, Sarah specializes in antique pieces and modern refinishing techniques. She has a passion for bringing new life to forgotten treasures.',
  'sarah@colorcraft.com',
  array['Antique Restoration', 'Wood Refinishing', 'Color Matching'],
  '{"linkedin": "https://linkedin.com/in/sarahjohnson", "instagram": "https://instagram.com/sarahrestores"}',
  true,
  1,
  '/images/team/sarah-johnson.jpg'
),
(
  'Michael Chen',
  'Creative Director & Painter',
  'Michael brings artistic vision to every project with his background in fine arts and interior design. He excels at color consultation and custom finishes.',
  'michael@colorcraft.com',
  array['Custom Finishes', 'Color Consultation', 'Artistic Design'],
  '{"instagram": "https://instagram.com/michaelcreates", "portfolio": "https://michaelchen.art"}',
  true,
  2,
  '/images/team/michael-chen.jpg'
),
(
  'Emma Rodriguez',
  'Project Manager & Customer Relations',
  'Emma ensures every project runs smoothly from consultation to completion. Her attention to detail and communication skills make her the perfect liaison between our team and clients.',
  'emma@colorcraft.com',
  array['Project Management', 'Customer Service', 'Quality Assurance'],
  '{"linkedin": "https://linkedin.com/in/emmarodriguez"}',
  true,
  3,
  '/images/team/emma-rodriguez.jpg'
),
(
  'David Thompson',
  'Master Craftsman',
  'A third-generation furniture craftsman, David brings traditional techniques and modern innovation to every restoration. His expertise in structural repairs is unmatched.',
  'david@colorcraft.com',
  array['Structural Repair', 'Traditional Techniques', 'Hardware Restoration'],
  '{}',
  false,
  4,
  '/images/team/david-thompson.jpg'
);

-- Grant permissions
grant all on public.team to authenticated;
grant all on public.team to service_role;

-- Success message
select 'Team table created successfully with sample data!' as message; 