-- Portfolio Projects Table Migration
-- This creates the portfolio table for the application

-- Create portfolio table (matches application code expectations)
CREATE TABLE IF NOT EXISTS portfolio (
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
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Portfolio policies - viewable by everyone
CREATE POLICY "Portfolio projects are viewable by everyone."
  ON portfolio FOR SELECT
  USING (true);

-- Only admins can insert portfolio projects
CREATE POLICY "Only admins can insert portfolio projects."
  ON portfolio FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Only admins can update portfolio projects
CREATE POLICY "Only admins can update portfolio projects."
  ON portfolio FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Only admins can delete portfolio projects
CREATE POLICY "Only admins can delete portfolio projects."
  ON portfolio FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS portfolio_featured_idx ON portfolio(is_featured);
CREATE INDEX IF NOT EXISTS portfolio_created_at_idx ON portfolio(created_at);
CREATE INDEX IF NOT EXISTS portfolio_completion_date_idx ON portfolio(completion_date);

-- Create trigger for updated_at
CREATE TRIGGER update_portfolio_updated_at
  BEFORE UPDATE ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 