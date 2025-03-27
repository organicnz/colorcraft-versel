import Link from 'next/link';
import CustomerFormWrapper from './customer-form';

export const metadata = {
  title: 'New Customer | Color & Craft CRM',
  description: 'Add a new customer to your CRM',
};

export default function NewCustomerPage() {
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
        {/* Form will be rendered by a client component */}
        <CustomerFormWrapper />
      </div>
    </div>
  );
} 