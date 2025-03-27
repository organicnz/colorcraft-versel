import { createClient } from '@/lib/supabase/server';
import { Customer, Lead, Project, Communication } from '@/types/database.types';

export class CrmApi {
  // Customers
  static async getCustomers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async getCustomer(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*, projects(*), communications(*)')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async createCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async updateCustomer(id: string, customer: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customers')
      .update({ ...customer, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Leads
  static async getLeads() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async getLead(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .select('*, communications(*)')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async updateLead(id: string, lead: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('leads')
      .update({ ...lead, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async convertLeadToCustomer(leadId: string) {
    const supabase = createClient();
    
    // Get the lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();
    
    if (leadError) throw new Error(leadError.message);
    
    // Create a customer from the lead
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: 'active',
        source: lead.source,
        notes: lead.notes,
        user_id: lead.user_id
      })
      .select()
      .single();
    
    if (customerError) throw new Error(customerError.message);
    
    // Update the lead status
    const { error: updateError } = await supabase
      .from('leads')
      .update({ 
        status: 'converted', 
        updated_at: new Date().toISOString() 
      })
      .eq('id', leadId);
    
    if (updateError) throw new Error(updateError.message);
    
    return { lead, customer };
  }

  // Projects
  static async getProjects() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, customers(name, email)')
      .order('updated_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async getProject(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*, customers(*), communications(*)')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  static async updateProject(id: string, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Communications
  static async addCommunication(communication: Omit<Communication, 'id' | 'created_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('communications')
      .insert(communication)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }

  // Dashboard data
  static async getDashboardStats() {
    const supabase = createClient();
    
    // Get counts for various metrics
    const [
      { count: customerCount, error: customerError },
      { count: leadCount, error: leadError },
      { count: projectCount, error: projectError },
      { count: activeProjectCount, error: activeProjectError }
    ] = await Promise.all([
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true })
        .not('status', 'eq', 'converted').not('status', 'eq', 'lost'),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true })
        .in('status', ['scheduled', 'in_progress'])
    ]);
    
    if (customerError || leadError || projectError || activeProjectError) {
      throw new Error('Error fetching dashboard stats');
    }
    
    // Get recent activities
    const { data: recentActivity, error: activityError } = await supabase
      .from('communications')
      .select('*, customers(name), leads(name)')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (activityError) throw new Error(activityError.message);
    
    return {
      counts: {
        customers: customerCount,
        leads: leadCount,
        projects: projectCount,
        activeProjects: activeProjectCount
      },
      recentActivity
    };
  }
} 