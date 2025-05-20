import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, DollarSign, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react"
import { getDashboardStats } from "@/app/actions/invoices"
import { getRecentEmails } from "@/app/actions/email-templates"
import { DashboardClient } from "./DashboardClient"

// Default stats to use when data can't be loaded
const defaultStats = {
  totalRevenue: 0,
  revenueChangePercent: 0,
  pendingInvoices: { count: 0, total: 0 },
  paidInvoices: { count: 0 },
  overdueInvoices: { count: 0, total: 0 },
  recentInvoices: [],
}

export default async function DashboardPage() {
  // Get dashboard data with error handling
  let statsSuccess = false;
  let stats = defaultStats;
  let emailsSuccess = false;
  let emails: any[] = [];
  
  try {
    const statsResponse = await getDashboardStats();
    statsSuccess = statsResponse.success;
    stats = statsResponse.stats || defaultStats;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
  
  try {
    const emailsResponse = await getRecentEmails();
    emailsSuccess = emailsResponse.success;
    emails = emailsResponse.emails || [];
  } catch (error) {
    console.error("Error fetching emails:", error);
  }

  return <DashboardClient 
    stats={stats}
    emails={emails}
    statsSuccess={statsSuccess}
    emailsSuccess={emailsSuccess}
  />
}

function Badge({ invoice }: { invoice: { status: string } }) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "sent":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyles(invoice.status)}`}>
      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
    </span>
  )
}

function EmailBadge({ email }: { email: { status: string } }) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyles(email.status)}`}>
      {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
    </span>
  )
}
