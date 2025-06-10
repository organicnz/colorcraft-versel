# Database Schema Summary

## Overview

Your ColorCraft application uses **Supabase PostgreSQL** with multiple tables for portfolio management, CRM, and user management. The database schema has evolved through several migrations.

## 📊 **Current Tables Structure**

### 1. **`users` Table** 
*Extends Supabase auth.users with additional profile information*

```sql
CREATE TABLE public.users (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'customer',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT role_check CHECK (role IN ('admin', 'customer'))
);
```

**Key Features:**
- ✅ References Supabase auth system
- ✅ Role-based access control (admin/customer)
- ✅ Auto-timestamps with triggers

---

### 2. **`portfolio` Table** 
*Main portfolio projects table (evolved through migrations)*

```sql
CREATE TABLE public.portfolio (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  brief_description text NOT NULL,
  before_images text[] NOT NULL DEFAULT '{}',
  after_images text[] NOT NULL DEFAULT '{}',
  techniques text[] DEFAULT '{}',
  materials text[] DEFAULT '{}',
  completion_date date,
  client_name text,
  client_testimonial text,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  
  -- Migration: User tracking fields
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  
  -- Migration: Status fields
  is_published boolean DEFAULT false NOT NULL,
  is_draft boolean DEFAULT true NOT NULL,
  is_archived boolean DEFAULT false NOT NULL,
  
  -- ⭐ NEW: Status field (your recent migration)
  status text CHECK (status IN ('published', 'draft', 'archived')) DEFAULT 'draft' NOT NULL
);
```

**Evolution Timeline:**
1. **Initial**: Basic portfolio fields
2. **User Tracking**: Added `created_by`, `updated_by`, `is_archived` 
3. **Status Booleans**: Added `is_published`, `is_draft`
4. **⭐ Status Field**: Added unified `status` field (your recent work)

**Current Status Migration State:**
- ✅ **Status field added** with constraint
- ✅ **Data migrated** from boolean fields to status field
- ✅ **Performance indexes** created
- 🔄 **Transition period**: Both boolean fields and status field exist

---

### 3. **`projects` Table** (Original Drizzle Schema)
*This appears to be the original table from Drizzle migrations - may be unused*

```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id),
  title varchar(255) NOT NULL,
  description text,
  image_url text,
  is_published boolean DEFAULT false NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);
```

**⚠️ Note**: This table may be legacy/unused since you're using the `portfolio` table.

---

### 4. **`customers` Table** (CRM)

```sql
CREATE TABLE public.customers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  notes text,
  customer_since timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
```

---

### 5. **`services` Table**

```sql
CREATE TABLE public.services (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  brief_description text NOT NULL,
  image_url text,
  price_range text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
```

---

### 6. **`inquiries` Table** (Quote Requests)

```sql
CREATE TABLE public.inquiries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id),
  service_id uuid REFERENCES public.services(id),
  status text NOT NULL DEFAULT 'pending',
  description text NOT NULL,
  furniture_type text NOT NULL,
  furniture_dimensions text,
  furniture_images text[],
  preferred_timeline text,
  budget_range text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT status_check CHECK (status IN ('pending', 'quoted', 'accepted', 'declined', 'completed'))
);
```

---

### 7. **`client_projects` Table** (CRM Projects)

```sql
CREATE TABLE public.client_projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) NOT NULL,
  inquiry_id uuid REFERENCES public.inquiries(id),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'planning',
  start_date date,
  deadline date,
  completion_date date,
  price numeric(10,2),
  deposit_amount numeric(10,2),
  deposit_paid boolean DEFAULT false,
  final_paid boolean DEFAULT false,
  progress_images text[],
  progress_notes text[],
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT status_check CHECK (status IN ('planning', 'in_progress', 'completed', 'cancelled'))
);
```

---

### 8. **`site_content` Table** (CMS)

```sql
CREATE TABLE public.site_content (
  id text PRIMARY KEY,
  title text NOT NULL,
  content jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);
```

---

## 🔧 **Database Indexes**

### Portfolio Table Indexes
```sql
-- Performance indexes for portfolio
CREATE INDEX portfolio_created_by_idx ON portfolio(created_by);
CREATE INDEX portfolio_updated_by_idx ON portfolio(updated_by);
CREATE INDEX portfolio_archived_idx ON portfolio(is_archived);
CREATE INDEX portfolio_active_status_idx ON portfolio(is_archived, is_published, is_draft);

-- ⭐ NEW: Status field indexes (your recent migration)
CREATE INDEX portfolio_status_idx ON portfolio(status);
CREATE INDEX portfolio_status_created_idx ON portfolio(status, created_at);
```

---

## 🔐 **Row Level Security (RLS) Policies**

### Portfolio Table Policies
```sql
-- Public can view published, non-archived portfolios
CREATE POLICY "Published portfolio projects are viewable by everyone."
  ON portfolio FOR SELECT
  USING (is_published = true AND is_archived = false);

-- Admins can view all portfolios
CREATE POLICY "Admins can view all portfolio projects."
  ON portfolio FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Only admins can modify portfolios
CREATE POLICY "Only admins can insert portfolio projects."
  ON portfolio FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Only admins can update portfolio projects."
  ON portfolio FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Only admins can delete portfolio projects."
  ON portfolio FOR DELETE
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));
```

---

## 🔄 **Database Triggers**

### Auto-Update Triggers
```sql
-- Automatically set updated_by and updated_at on portfolio updates
CREATE OR REPLACE FUNCTION set_updated_by_on_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_by = auth.uid();
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_portfolio_updated_by
  BEFORE UPDATE ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_by_on_portfolio();

-- Automatically set created_by on portfolio inserts
CREATE OR REPLACE FUNCTION set_created_by_on_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_portfolio_created_by
  BEFORE INSERT ON portfolio
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by_on_portfolio();
```

---

## 📊 **Schema Evolution & Migration Status**

### ✅ **Completed Migrations**
1. **User Tracking Migration** - Added user audit fields
2. **Status Boolean Migration** - Added is_published, is_draft, is_archived  
3. **⭐ Status Field Migration** - Added unified status field

### 🔄 **Current Transition State**
Your portfolio table is currently in a **transition state** with both:
- **Legacy**: `is_published`, `is_draft`, `is_archived` (boolean fields)
- **Modern**: `status` (enum field with 'published'|'draft'|'archived')

### 🎯 **Next Steps Recommendations**

1. **Run Status Migration**: Use `/dashboard/admin/migrations` to complete the status field migration
2. **Test Status Field**: Verify all CRUD operations work with the status field  
3. **Update RLS Policies**: Update policies to use status field instead of boolean fields
4. **Cleanup**: Remove deprecated boolean fields after testing

---

## 🛠 **Available Migration APIs**

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `/api/migrate-portfolio-status` | Migrate to status field | ✅ Ready |
| `/api/migrate-user-tracking` | Add user tracking | ✅ Applied |
| `/api/migrate-portfolio-fields` | Add boolean status fields | ✅ Applied |
| `/dashboard/admin/migrations` | Migration UI | ✅ Available |

---

## 📝 **Type Definitions**

### Current TypeScript Types
```typescript
// Modern status-based type (recommended)
export type PortfolioStatus = 'published' | 'draft' | 'archived'

export type PortfolioProject = {
  id: string
  title: string
  description: string | null
  brief_description: string
  before_images: string[]
  after_images: string[]
  techniques: string[] | null
  materials: string[] | null
  completion_date: string | null
  client_name: string | null
  client_testimonial: string | null
  is_featured: boolean
  status: PortfolioStatus  // ⭐ Modern approach
  created_by?: string
  updated_by?: string
  created_at: string
  updated_at: string
}
```

---

## 🎯 **Summary**

Your database schema is **modern and well-structured** with:
- ✅ **Proper RLS security**
- ✅ **Efficient indexing**
- ✅ **Auto-audit trails**
- ✅ **Type safety**
- ✅ **Status field migration ready**

The main portfolio table successfully transitioned from complex boolean logic to a clean status enum approach, making it much more maintainable and scalable for future features. 