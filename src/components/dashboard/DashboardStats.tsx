"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Briefcase, TrendingUp } from "lucide-react"

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

interface DashboardStatsProps {
  stats?: {
    totalProjects: number
    activeProjects: number
    totalCustomers: number
    monthlyRevenue: number
  }
}

export default function DashboardStats({ 
  stats = {
    totalProjects: 0,
    activeProjects: 0,
    totalCustomers: 0,
    monthlyRevenue: 0
  }
}: DashboardStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Projects"
        value={stats.totalProjects}
        icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "12%", isPositive: true }}
      />
      <StatsCard
        title="Active Projects"
        value={stats.activeProjects}
        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "5%", isPositive: true }}
      />
      <StatsCard
        title="Total Customers"
        value={stats.totalCustomers}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "8%", isPositive: true }}
      />
      <StatsCard
        title="Monthly Revenue"
        value={`$${stats.monthlyRevenue.toLocaleString()}`}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: "15%", isPositive: true }}
      />
    </div>
  )
} 