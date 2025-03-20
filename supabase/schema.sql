-- Users table (extends Supabase auth.users)
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

-- Portfolio projects
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  brief_description text not null,
  before_images text[] not null,
  after_images text[] not null,
  techniques text[],
  materials text[],
  completion_date date,
  client_name text,
  client_testimonial text,
  is_featured boolean default false,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Customers (CRM)
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  full_name text not null,
  email text not null,
  phone text,
  address text,
  notes text,
  customer_since timestamp with time zone default now() not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Services
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  brief_description text not null,
  image_url text,
  price_range text,
  is_active boolean default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Inquiries/Quotes
create table public.inquiries (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.customers(id),
  service_id uuid references public.services(id),
  status text not null default 'pending',
  description text not null,
  furniture_type text not null,
  furniture_dimensions text,
  furniture_images text[],
  preferred_timeline text,
  budget_range text,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint status_check check (status in ('pending', 'quoted', 'accepted', 'declined', 'completed'))
);

-- Projects (CRM client projects, not portfolio)
create table public.client_projects (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.customers(id) not null,
  inquiry_id uuid references public.inquiries(id),
  title text not null,
  description text,
  status text not null default 'planning',
  start_date date,
  deadline date,
  completion_date date,
  price numeric(10,2),
  deposit_amount numeric(10,2),
  deposit_paid boolean default false,
  final_paid boolean default false,
  progress_images text[],
  progress_notes text[],
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint status_check check (status in ('planning', 'in_progress', 'completed', 'cancelled'))
);

-- Site content for admin editing
create table public.site_content (
  id text primary key,
  title text not null,
  content jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Row Level Security Policies
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.customers enable row level security;
alter table public.services enable row level security;
alter table public.inquiries enable row level security;
alter table public.client_projects enable row level security;
alter table public.site_content enable row level security;

-- Users policies
create policy "Public users are viewable by everyone."
  on users for select
  using (true);

create policy "Users can update own record."
  on users for update
  using (auth.uid() = id);

-- Projects policies
create policy "Projects are viewable by everyone."
  on projects for select
  using (true);

create policy "Only admins can insert projects."
  on projects for insert
  with check (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can update projects."
  on projects for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can delete projects."
  on projects for delete
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Customers policies
create policy "Customers are viewable by admins."
  on customers for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Customers can view own record."
  on customers for select
  using (user_id = auth.uid());

create policy "Only admins can insert customers."
  on customers for insert
  with check (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can update customers."
  on customers for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Services policies
create policy "Services are viewable by everyone."
  on services for select
  using (true);

create policy "Only admins can insert services."
  on services for insert
  with check (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can update services."
  on services for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can delete services."
  on services for delete
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Inquiries policies
create policy "Inquiries are viewable by admins."
  on inquiries for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Customers can view own inquiries."
  on inquiries for select
  using (
    customer_id in (
      select id from customers where user_id = auth.uid()
    )
  );

create policy "Anyone can insert inquiries."
  on inquiries for insert
  with check (true);

create policy "Only admins can update inquiries."
  on inquiries for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Client Projects policies
create policy "Client projects are viewable by admins."
  on client_projects for select
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Customers can view own projects."
  on client_projects for select
  using (
    customer_id in (
      select id from customers where user_id = auth.uid()
    )
  );

create policy "Only admins can insert client projects."
  on client_projects for insert
  with check (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can update client projects."
  on client_projects for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can delete client projects."
  on client_projects for delete
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Site Content policies
create policy "Site content is viewable by everyone."
  on site_content for select
  using (true);

create policy "Only admins can modify site content."
  on site_content for insert
  with check (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can update site content."
  on site_content for update
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

create policy "Only admins can delete site content."
  on site_content for delete
  using (
    exists (
      select 1 from users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'customer');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create some initial services
INSERT INTO public.services (name, description, brief_description, price_range, is_active)
VALUES 
  ('Furniture Painting', 'Complete furniture painting services using high-quality paints and finishes. We can transform your old furniture with custom colors and techniques.', 'Transform your furniture with custom colors and professional finishes.', '$200 - $800', true),
  ('Restoration', 'Full restoration services for antique and vintage furniture. We repair, refinish, and restore your cherished pieces to their former glory.', 'Bring your antique and vintage pieces back to life.', '$300 - $1200', true),
  ('Custom Finishes', 'Specialty finishes including distressing, gilding, patina effects, and more. Create a truly unique look for your furniture.', 'Create unique, one-of-a-kind looks with our specialty finishes.', '$250 - $1000', true),
  ('Color Consulting', 'Not sure which colors or finishes would work best? Our color consultation service helps you make the perfect choice for your space.', 'Expert guidance to select the perfect colors for your furniture and space.', '$75 - $150', true);

-- Create some initial site content
INSERT INTO public.site_content (id, title, content)
VALUES 
  ('home_intro', 'Breathe New Life Into Your Furniture', '{"text": "<p>Welcome to our furniture painting studio, where we transform tired, outdated furniture into beautiful statement pieces. With our expert craftsmanship and eye for detail, we can revitalize your cherished items with custom colors and finishes.</p>"}'),
  ('about_intro', 'Our Story', '{"text": "<p>Founded in 2015 by master craftsman Jane Doe, our studio has transformed thousands of furniture pieces, from family heirlooms to flea market finds. We believe in quality workmanship, environmentally-friendly practices, and bringing your vision to life.</p>"}'),
  ('services_intro', 'Our Services', '{"text": "<p>We offer a range of furniture painting and restoration services to meet your needs. Whether you''re looking to refresh a single piece or transform an entire room, our skilled team can help.</p>"}'),
  ('portfolio_intro', 'Our Portfolio', '{"text": "<p>Browse through our collection of furniture transformation projects. Each piece tells a story of renewal and creativity.</p>"}'),
  ('contact_intro', 'Get In Touch', '{"text": "<p>Ready to transform your furniture? Contact us today for a consultation or quote. We''d love to hear about your project and how we can help bring your vision to life.</p>"}'); 