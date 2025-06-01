"use client"

import { useState, useEffect, useCallback } from "react"

export interface DashboardStats {
  totalRevenue: number
  activeClients: number
  pendingInvoices: {
    count: number
    total: number
  }
  collectionRate: number
  monthlyRevenue: number
  recentInvoices: Array<{
    id: number
    invoice_number: string
    client_name: string
    total: number
    status: string
    due_date: string
  }>
}

export interface MonthlyGoals {
  revenue: {
    target: number
    current: number
    progress: number
  }
  invoices: {
    target: number
    current: number
    progress: number
  }
  clients: {
    target: number
    current: number
    progress: number
  }
}

export interface AIInsight {
  id: string
  type: 'success' | 'warning' | 'info'
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoals | null>(null)
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch dashboard stats
      const response = await fetch('/api/dashboard/stats')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
        setMonthlyGoals(data.monthlyGoals || {
          revenue: { target: 10000, current: data.stats?.monthlyRevenue || 0, progress: 0 },
          invoices: { target: 50, current: 0, progress: 0 },
          clients: { target: 25, current: data.stats?.activeClients || 0, progress: 0 }
        })
        
        // Generate AI insights based on data
        const insights: AIInsight[] = []
        
        if (data.stats?.pendingInvoices?.count > 0) {
          insights.push({
            id: 'pending-invoices',
            type: 'warning',
            title: 'Pending Invoices Detected',
            description: `You have ${data.stats.pendingInvoices.count} invoices pending review worth £${data.stats.pendingInvoices.total.toLocaleString()}`,
            action: {
              label: 'Review Invoices',
              href: '/invoices?status=pending'
            }
          })
        }

        if (data.stats?.collectionRate < 80) {
          insights.push({
            id: 'collection-rate',
            type: 'warning',
            title: 'Collection Rate Needs Attention',
            description: 'Your collection rate is below the recommended 80%. Consider following up on overdue invoices.',
            action: {
              label: 'View Overdue',
              href: '/invoices?status=overdue'
            }
          })
        }

        if (data.stats?.monthlyRevenue > 0) {
          insights.push({
            id: 'monthly-performance',
            type: 'success',
            title: 'Monthly Performance',
            description: `Your revenue this month is £${data.stats.monthlyRevenue.toLocaleString()}`,
            action: {
              label: 'View Analytics',
              href: '/analytics'
            }
          })
        }

        setAIInsights(insights)
      } else {
        throw new Error(data.message || 'Failed to fetch dashboard data')
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      
      // Set fallback data
      setStats({
        totalRevenue: 0,
        activeClients: 0,
        pendingInvoices: { count: 0, total: 0 },
        collectionRate: 0,
        monthlyRevenue: 0,
        recentInvoices: []
      })
      setMonthlyGoals({
        revenue: { target: 10000, current: 0, progress: 0 },
        invoices: { target: 50, current: 0, progress: 0 },
        clients: { target: 25, current: 0, progress: 0 }
      })
      setAIInsights([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    stats,
    monthlyGoals,
    aiInsights,
    isLoading,
    error,
    refetch
  }
} 