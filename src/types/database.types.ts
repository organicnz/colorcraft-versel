export type Customer = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive' | 'potential';
  source?: string;
  notes?: string;
  user_id?: string;
}

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  notes?: string;
  user_id?: string;
}

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string;
  customer_id: string;
  status: 'inquiry' | 'estimate' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  estimated_value?: number;
  final_value?: number;
  start_date?: string;
  due_date?: string;
  completion_date?: string;
  notes?: string;
}

export type Communication = {
  id: string;
  created_at: string;
  customer_id?: string;
  lead_id?: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  direction: 'inbound' | 'outbound';
  subject?: string;
  content: string;
  user_id: string;
  related_project_id?: string;
}

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>;
      };
      communications: {
        Row: Communication;
        Insert: Omit<Communication, 'id' | 'created_at'>;
        Update: Partial<Omit<Communication, 'id' | 'created_at'>>;
      };
    };
  };
} 