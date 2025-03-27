"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomerForm from '@/components/crm/CustomerForm';
import { useCreateCustomer } from '@/lib/crm/hooks';

export default function NewCustomerPage() {
  const router = useRouter();
  const { mutate: createCustomer, isPending } = useCreateCustomer();
  
  const handleSubmit = (data: any) => {
    createCustomer(data, {
      onSuccess: () => {
        router.push('/crm/customers');
      },
      onError: (error) => {
        console.error('Error creating customer:', error);
        // You would typically show an error toast or message here
      }
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/crm/customers"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Customers
        </Link>
        <h1 className="text-2xl font-bold">Add New Customer</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <CustomerForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
} 