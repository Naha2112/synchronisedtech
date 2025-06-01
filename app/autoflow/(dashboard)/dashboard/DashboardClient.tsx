"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { FormatCurrency } from "@/components/format-currency"
import { 
  FileText, 
  Users, 
  Calendar, 
  Plus, 
  TrendingUp, 
  DollarSign,
  Clock,
  Target,
  Brain,
  Zap,
  ArrowRight,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function DashboardClient() {
  const { 
    stats, 
    monthlyGoals, 
    aiInsights, 
    isLoading, 
    error, 
    refetch 
  } = useDashboardData()

  const quickActions: QuickAction[] = [
    {
      title: "Create Invoice",
      description: "Generate a new invoice for your clients",
      href: "/autoflow/invoices/new",
      icon: FileText,
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100"
    },
    {
      title: "Add Client",
      description: "Register a new client in your system",
      href: "/autoflow/clients/new",
      icon: Users,
      color: "bg-green-50 text-green-600 hover:bg-green-100"
    },
    {
      title: "Schedule Meeting",
      description: "Book an appointment with a client",
      href: "/autoflow/bookings/new",
      icon: Calendar,
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100"
    },
    {
      title: "AI Assistant",
      description: "Create invoices with natural language",
      href: "/autoflow/ai",
      icon: Brain,
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100"
    }
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'warning': return <Clock className="h-4 w-4 text-orange-600" />
      case 'info': return <Target className="h-4 w-4 text-blue-600" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50'
      case 'warning': return 'border-orange-200 bg-orange-50'
      case 'info': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load dashboard data: {error}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's what's happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-2xl font-bold">
                <FormatCurrency amount={stats?.totalRevenue || 0} />
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-2xl font-bold">{stats?.activeClients || 0}</p>
              <p className="text-sm text-muted-foreground">Active Clients</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-2xl font-bold">{stats?.pendingInvoices?.count || 0}</p>
              <p className="text-sm text-muted-foreground">Pending Invoices</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-2xl font-bold">{stats?.collectionRate || 0}%</p>
              <p className="text-sm text-muted-foreground">Collection Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to help you get things done faster</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="group">
                  <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{action.title}</h3>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Sidebar content removed for cleaner design */}
        </div>
      </div>
    </div>
  )
} 