-- Create users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'customer',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint role_check check (role in ('admin', 'customer'))
);

-- Enable RLS for users table
alter table public.users enable row level security;

-- Users policies
create policy "Public users are viewable by everyone."
  on users for select
  using (true);

create policy "Users can update own record."
  on users for update
  using (auth.uid() = id);

create policy "Users can insert own record."
  on users for insert
  with check (auth.uid() = id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create user record
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 