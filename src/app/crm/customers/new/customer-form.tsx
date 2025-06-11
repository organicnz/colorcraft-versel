"use client";

import { useRouter } from "next/navigation";
import CustomerForm from "@/components/crm/CustomerForm";
import { useCreateCustomer } from "@/lib/crm/hooks";

export default function CustomerFormWrapper() {
  const router = useRouter();
  const { mutate: createCustomer, isPending } = useCreateCustomer();

  const handleSubmit = (data: any) => {
    createCustomer(data, {
      onSuccess: () => {
        router.push("/crm/customers");
      },
      onError: (error) => {
        console.error("Error creating customer:", error);
        // You would typically show an error toast or message here
      },
    });
  };

  return <CustomerForm onSubmit={handleSubmit} isLoading={isPending} />;
}
