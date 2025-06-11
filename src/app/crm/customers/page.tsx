import Link from "next/link";
import { CrmApi } from "@/lib/crm/api";
import CustomerList from "@/components/crm/CustomerList";

export const metadata = {
  title: "Customers | Color & Craft CRM",
  description: "Manage your customer relationships",
};

export const dynamic = "force-dynamic"; // Make this page dynamic

export default async function CustomersPage() {
  let customers = [];

  try {
    customers = await CrmApi.getCustomers();
  } catch (error) {
    console.error("Error fetching customers:", error);
    // Return empty array as fallback
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CustomerList initialCustomers={customers} />
    </div>
  );
}
