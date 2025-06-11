export type Customer = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: "active" | "inactive" | "potential";
  source?: string;
  notes?: string;
  user_id?: string;
};

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  notes?: string;
  user_id?: string;
};

export interface User {
  id: string;
  email: string;
  role: "admin" | "contributor" | "customer";
  created_at: string | null;
  updated_at: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  brief_description?: string;
  before_images?: string[];
  after_images?: string[];
  techniques?: string[];
  materials?: string[];
  duration_days?: number;
  location?: string;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
  featured?: boolean;
  is_featured?: boolean;
  completion_date?: string;
  client_name?: string;
  client_testimonial?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  brief_description?: string;
  image_url?: string;
  price_range?: string;
  estimated_duration?: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  featured?: boolean;
}

export type Communication = {
  id: string;
  created_at: string;
  customer_id?: string;
  lead_id?: string;
  type: "email" | "call" | "meeting" | "note";
  direction: "inbound" | "outbound";
  subject?: string;
  content: string;
  user_id: string;
  related_project_id?: string;
};

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: Omit<Customer, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Lead, "id" | "created_at" | "updated_at">>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Project, "id" | "created_at" | "updated_at">>;
      };
      communications: {
        Row: Communication;
        Insert: Omit<Communication, "id" | "created_at">;
        Update: Partial<Omit<Communication, "id" | "created_at">>;
      };
    };
  };
}
