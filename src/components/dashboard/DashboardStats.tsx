"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Briefcase, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
}

function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value} from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface DashboardData {
  totalCustomers: number
  totalProjects: number
  totalInquiries: number
  totalRevenue: number
}

const DEFAULT_STATS: DashboardData = {
  totalCustomers: 0,
  totalProjects: 0,
  totalInquiries: 0,
  totalRevenue: 0,
}

export default function DashboardStats() {
  const supabase = createClient()

  const { data: stats = DEFAULT_STATS, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardData> => {
      try {
        // Get customer count
        const { count: customerCount, error: customerError } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true })

        if (customerError) throw customerError

        // Get project count
        const { count: projectCount, error: projectError } = await supabase
          .from("client_projects")
          .select("*", { count: "exact", head: true })

        if (projectError) throw projectError

        // Get inquiry count
        const { count: inquiryCount, error: inquiryError } = await supabase
          .from("inquiries")
          .select("*", { count: "exact", head: true })

        if (inquiryError) throw inquiryError

        // Get total revenue from completed projects
        const { data: revenueData, error: revenueError } = await supabase
          .from("client_projects")
          .select("price")
          .eq("status", "completed")
          .not("price", "is", null)

        if (revenueError) throw revenueError

        const totalRevenue = revenueData?.reduce((sum, project) => sum + (project.price || 0), 0) || 0

        return {
          totalCustomers: customerCount || 0,
          totalProjects: projectCount || 0,
          totalInquiries: inquiryCount || 0,
          totalRevenue,
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return DEFAULT_STATS
      }
    },
  })

  if (error) {
    console.error("Dashboard stats error:", error)
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Customers"
        value={stats.totalCustomers}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "12%", isPositive: true }}
      />
      <StatsCard
        title="Active Projects"
        value={stats.totalProjects}
        icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "5%", isPositive: true }}
      />
      <StatsCard
        title="Inquiries"
        value={stats.totalInquiries}
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "8%", isPositive: false }}
      />
      <StatsCard
        title="Total Revenue"
        value={`$${stats.totalRevenue.toLocaleString()}`}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "15%", isPositive: true }}
      />
    </div>
  )
} 