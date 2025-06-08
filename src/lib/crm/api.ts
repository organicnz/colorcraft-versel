import { createClient } from "@/lib/supabase/client";
import { Customer, Lead, Project, Communication } from "@/types/database.types";

export class CrmApi {
  // Customers
  static async getCustomers() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  static async getCustomer(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .select("*, projects(*), communications(*)")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async createCustomer(customer: Omit<Customer, "id" | "created_at" | "updated_at">) {
    const supabase = createClient();
    const { data, error } = await supabase.from("customers").insert(customer).select().single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateCustomer(
    id: string,
    customer: Partial<Omit<Customer, "id" | "created_at" | "updated_at">>
  ) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("customers")
      .update({ ...customer, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Leads
  static async getLeads() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  static async getLead(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*, communications(*)")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async createLead(lead: Omit<Lead, "id" | "created_at" | "updated_at">) {
    const supabase = createClient();
    const { data, error } = await supabase.from("leads").insert(lead).select().single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateLead(
    id: string,
    lead: Partial<Omit<Lead, "id" | "created_at" | "updated_at">>
  ) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .update({ ...lead, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async convertLeadToCustomer(leadId: string) {
    const supabase = createClient();

    // Get the lead data
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .single();

    if (leadError) throw new Error(leadError.message);

    // Create a customer from the lead
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: "active",
        source: lead.source,
        notes: lead.notes,
        user_id: lead.user_id,
      })
      .select()
      .single();

    if (customerError) throw new Error(customerError.message);

    // Update the lead status
    const { error: updateError } = await supabase
      .from("leads")
      .update({
        status: "converted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);

    if (updateError) throw new Error(updateError.message);

    return { lead, customer };
  }

  // Projects
  static async getProjects() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, customers(name, email)")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  static async getProject(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, customers(*), communications(*)")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async createProject(project: Omit<Project, "id" | "created_at" | "updated_at">) {
    const supabase = createClient();
    const { data, error } = await supabase.from("projects").insert(project).select().single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateProject(
    id: string,
    project: Partial<Omit<Project, "id" | "created_at" | "updated_at">>
  ) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Communications
  static async addCommunication(communication: Omit<Communication, "id" | "created_at">) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("communications")
      .insert(communication)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getCommunications(customerId?: string, leadId?: string) {
    const supabase = createClient();
    let query = supabase
      .from("communications")
      .select("*")
      .order("created_at", { ascending: false });

    if (customerId) {
      query = query.eq("customer_id", customerId);
    }

    if (leadId) {
      query = query.eq("lead_id", leadId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data;
  }

  // Dashboard stats
  static async getDashboardStats() {
    const supabase = createClient();

    // Get counts for different entities
    const [customersResult, leadsResult, projectsResult] = await Promise.all([
      supabase.from("customers").select("id", { count: "exact" }),
      supabase.from("leads").select("id", { count: "exact" }),
      supabase.from("projects").select("id", { count: "exact" }),
    ]);

    if (customersResult.error) throw new Error(customersResult.error.message);
    if (leadsResult.error) throw new Error(leadsResult.error.message);
    if (projectsResult.error) throw new Error(projectsResult.error.message);

    return {
      totalCustomers: customersResult.count || 0,
      totalLeads: leadsResult.count || 0,
      totalProjects: projectsResult.count || 0,
    };
  }
}
