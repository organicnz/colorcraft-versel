"use client"

import { z } from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { Customer } from "@/types/crm"

const customerSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

type CustomerFormProps = {
  initialData?: Partial<Customer>
  onSuccess?: () => void
}

export default function CustomerForm({ initialData, onSuccess }: CustomerFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof customerSchema>) {
    setIsLoading(true)
    setError(null)
    
    try {
      if (initialData?.id) {
        // Update existing customer
        const { error: supabaseError } = await supabase
          .from("customers")
          .update(values)
          .eq("id", initialData.id)
          
        if (supabaseError) throw supabaseError
      } else {
        // Create new customer
        const { error: supabaseError } = await supabase
          .from("customers")
          .insert(values)
          
        if (supabaseError) throw supabaseError
      }
      
      if (onSuccess) onSuccess()
    } catch (err: any) {
      console.error("Error saving customer:", err)
      setError(err.message || "An error occurred while saving the customer")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="full_name" className="block text-sm font-medium">
          Full Name *
        </label>
        <input
          id="full_name"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
          {...form.register("full_name")}
        />
        {form.formState.errors.full_name && (
          <p className="text-sm text-red-500">{form.formState.errors.full_name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email *
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium">
          Phone
        </label>
        <input
          id="phone"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
          {...form.register("phone")}
        />
        {form.formState.errors.phone && (
          <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium">
          Address
        </label>
        <input
          id="address"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
          {...form.register("address")}
        />
        {form.formState.errors.address && (
          <p className="text-sm text-red-500">{form.formState.errors.address.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none"
          {...form.register("notes")}
        />
        {form.formState.errors.notes && (
          <p className="text-sm text-red-500">{form.formState.errors.notes.message}</p>
        )}
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 focus:outline-none disabled:opacity-50"
      >
        {isLoading
          ? "Saving..."
          : initialData?.id
          ? "Update Customer"
          : "Add Customer"}
      </button>
    </form>
  )
} 