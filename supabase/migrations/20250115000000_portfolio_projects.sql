-- Portfolio Projects Table Migration
-- This creates the portfolio projects table separate from the CRM projects table

-- Create portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
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

-- Enable Row Level Security
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Portfolio projects policies - viewable by everyone
CREATE POLICY "Portfolio projects are viewable by everyone."
  ON portfolio_projects FOR SELECT
  USING (true);

-- Only admins can insert portfolio projects
CREATE POLICY "Only admins can insert portfolio projects."
  ON portfolio_projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Only admins can update portfolio projects
CREATE POLICY "Only admins can update portfolio projects."
  ON portfolio_projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Only admins can delete portfolio projects
CREATE POLICY "Only admins can delete portfolio projects."
  ON portfolio_projects FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS portfolio_projects_featured_idx ON portfolio_projects(is_featured);
CREATE INDEX IF NOT EXISTS portfolio_projects_created_at_idx ON portfolio_projects(created_at);
CREATE INDEX IF NOT EXISTS portfolio_projects_completion_date_idx ON portfolio_projects(completion_date);

-- Create trigger for updated_at
CREATE TRIGGER update_portfolio_projects_updated_at
  BEFORE UPDATE ON portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 