-- Create tables for CRM functionality

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'potential')),
  source TEXT,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy for customers
CREATE POLICY "Authenticated users can CRUD their own customers" ON customers
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS customers_user_id_idx ON customers(user_id);
CREATE INDEX IF NOT EXISTS customers_email_idx ON customers(email);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  source TEXT NOT NULL,
  notes TEXT,
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS on leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy for leads
CREATE POLICY "Authenticated users can CRUD their own leads" ON leads
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS leads_user_id_idx ON leads(user_id);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('inquiry', 'estimate', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  estimated_value DECIMAL,
  final_value DECIMAL,
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  notes TEXT
);

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for projects that joins to customers table
CREATE POLICY "Users can CRUD their own projects" ON projects
  USING (EXISTS (
    SELECT 1 FROM customers
    WHERE customers.id = projects.customer_id
    AND customers.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM customers
    WHERE customers.id = projects.customer_id
    AND customers.user_id = auth.uid()
  ));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS projects_customer_id_idx ON projects(customer_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);

-- Communications table
CREATE TABLE IF NOT EXISTS communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'call', 'meeting', 'note')),
  direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject TEXT,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  related_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  CHECK (
    (customer_id IS NOT NULL AND lead_id IS NULL) OR
    (customer_id IS NULL AND lead_id IS NOT NULL)
  )
);

-- Enable RLS on communications
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Create policy for communications
CREATE POLICY "Users can CRUD their own communications" ON communications
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS communications_customer_id_idx ON communications(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS communications_lead_id_idx ON communications(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS communications_user_id_idx ON communications(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 