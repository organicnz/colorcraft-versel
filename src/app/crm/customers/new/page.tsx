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

      <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-xl shadow-glass border border-white/30 dark:border-white/10 p-6 transition-all duration-300 hover:bg-white/40 hover:shadow-glass-heavy relative">
        {/* Glass gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 pointer-events-none rounded-xl" />

        <div className="relative z-10">
          {/* Form will be rendered by a client component */}
          <CustomerFormWrapper />
        </div>
      </div>
    </div>
  );
} 