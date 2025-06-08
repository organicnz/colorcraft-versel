import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'CRM Dashboard | Color & Craft',
  description: 'Manage your customer relationships and project leads',
};

// Sample data for demo purposes
const SAMPLE_CUSTOMERS = [
  {
    id: '1',
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    phone: '(555) 123-4567',
    status: 'Active',
    projectCount: 3,
    lastContact: '2023-11-15',
  },
  {
    id: '2',
    name: 'Michael Winters',
    email: 'michael.w@example.com',
    phone: '(555) 987-6543',
    status: 'Lead',
    projectCount: 0,
    lastContact: '2023-12-05',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 456-7890',
    status: 'Active',
    projectCount: 1,
    lastContact: '2024-01-10',
  },
  {
    id: '4',
    name: 'David Rodriguez',
    email: 'david.r@example.com',
    phone: '(555) 321-0987',
    status: 'Inactive',
    projectCount: 2,
    lastContact: '2023-08-22',
  },
];

export default async function CRMDashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Relationship Management</h1>
        <Button asChild>
          <Link href="/dashboard/crm/new">Add Customer</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Customers</CardTitle>
            <CardDescription>All registered customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{SAMPLE_CUSTOMERS.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Currently in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>New Leads</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Manage your customers and their projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Projects</th>
                  <th className="text-left py-3 px-4">Last Contact</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_CUSTOMERS.map((customer) => (
                  <tr key={customer.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{customer.name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={
                        customer.status === 'Active' ? 'default' : 
                        customer.status === 'Lead' ? 'secondary' : 'outline'
                      }>
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{customer.projectCount}</td>
                    <td className="py-3 px-4">{customer.lastContact}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/crm/customers/${customer.id}`}>
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 