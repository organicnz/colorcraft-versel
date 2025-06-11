"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Customer {
  id: string
  full_name: string
  email: string
  phone?: string | null
  address?: string | null
  notes?: string | null
  customer_since: string
  created_at: string
  updated_at: string
}

interface CustomerTableProps {
  onEditCustomer?: (customer: Customer) => void
  onDeleteCustomer?: (customerId: string) => void
}

export default function CustomerTable({ 
  onEditCustomer, 
  onDeleteCustomer 
}: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    setLoading(true)
    try {
      let query = supabase
        .from("customers")
        .select("*")
        .order("full_name", { ascending: true })

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [searchTerm])

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return

    try {
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId)

      if (error) throw error

      setCustomers(customers.filter(c => c.id !== customerId))
      if (onDeleteCustomer) onDeleteCustomer(customerId)
    } catch (error) {
      console.error("Error deleting customer:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Customers</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? "No customers found matching your search." : "No customers found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Phone</th>
                  <th className="text-left py-2 px-4">Customer Since</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{customer.full_name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{customer.phone || "-"}</td>
                    <td className="py-3 px-4">
                      {new Date(customer.customer_since).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {onEditCustomer && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditCustomer(customer)}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 