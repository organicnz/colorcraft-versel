import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CrmApi } from './api';
import { Customer, Lead, Project, Communication } from '@/types/database.types';

// Customer hooks
export function useCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: () => CrmApi.getCustomers(),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => CrmApi.getCustomer(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => 
      CrmApi.createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, customer }: { 
      id: string, 
      customer: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>> 
    }) => CrmApi.updateCustomer(id, customer),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', id] });
    },
  });
}

// Lead hooks
export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: () => CrmApi.getLeads(),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['leads', id],
    queryFn: () => CrmApi.getLead(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => 
      CrmApi.createLead(lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, lead }: { 
      id: string, 
      lead: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>> 
    }) => CrmApi.updateLead(id, lead),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leads', id] });
    },
  });
}

export function useConvertLeadToCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (leadId: string) => CrmApi.convertLeadToCustomer(leadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Project hooks
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => CrmApi.getProjects(),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => CrmApi.getProject(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => 
      CrmApi.createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, project }: { 
      id: string, 
      project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>> 
    }) => CrmApi.updateProject(id, project),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
  });
}

// Communication hooks
export function useAddCommunication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (communication: Omit<Communication, 'id' | 'created_at'>) => 
      CrmApi.addCommunication(communication),
    onSuccess: (_, { customer_id, lead_id }) => {
      if (customer_id) {
        queryClient.invalidateQueries({ queryKey: ['customers', customer_id] });
      }
      if (lead_id) {
        queryClient.invalidateQueries({ queryKey: ['leads', lead_id] });
      }
    },
  });
}

// Dashboard hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => CrmApi.getDashboardStats(),
  });
} 