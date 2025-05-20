"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, DollarSign, Clock, CheckCircle2, AlertCircle, Plus, PoundSterling, Euro, Currency } from "lucide-react"
import { FormatCurrency } from "@/components/format-currency"
import { useCurrency } from "@/components/currency-provider"

interface DashboardClientProps {
  stats: any
  emails: any[]
  statsSuccess: boolean
  emailsSuccess: boolean
}

export function DashboardClient({ stats, emails, statsSuccess, emailsSuccess }: DashboardClientProps) {
  const { currency } = useCurrency()
  
  // Get currency icon based on selected currency
  const getCurrencyIcon = () => {
    switch(currency) {
      case 'GBP':
        return <PoundSterling className="h-4 w-4 text-muted-foreground" />;
      case 'EUR':
        return <Euro className="h-4 w-4 text-muted-foreground" />;
      case 'JPY':
        return <Currency className="h-4 w-4 text-muted-foreground" />;
      case 'AUD':
      case 'CAD':
      case 'USD':
      default:
        return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    }
  }
  
  const currencyIcon = getCurrencyIcon();

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>

      {statsSuccess && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              {currencyIcon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <FormatCurrency amount={stats.totalRevenue} />
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.revenueChangePercent > 0 ? '+' : ''}{stats.revenueChangePercent}% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingInvoices.count}</div>
              <p className="text-xs text-muted-foreground">
                <FormatCurrency amount={stats.pendingInvoices.total} /> outstanding
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.paidInvoices.count}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overdueInvoices.count}</div>
              <p className="text-xs text-muted-foreground">
                <FormatCurrency amount={stats.overdueInvoices.total} /> overdue
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Recent Invoices</TabsTrigger>
          <TabsTrigger value="emails">Recent Emails</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Overview of your latest invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsSuccess &&
                  stats.recentInvoices.map((invoice: any) => (
                    <div key={invoice.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="grid gap-1">
                        <div className="font-semibold">{invoice.client}</div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.invoice_number} · {new Date(invoice.due_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-medium">
                          <FormatCurrency amount={invoice.amount} />
                        </div>
                        <Badge invoice={invoice} />
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/invoices/${invoice.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">View invoice</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}

                {(!statsSuccess || stats.recentInvoices.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground">No recent invoices found</div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" asChild>
                  <Link href="/invoices">View all invoices</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Emails</CardTitle>
              <CardDescription>Overview of your latest email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emailsSuccess &&
                  emails.map((email: any) => (
                    <div key={email.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="grid gap-1">
                        <div className="font-semibold">{email.subject}</div>
                        <div className="text-sm text-muted-foreground">
                          {email.recipients} · {email.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <EmailBadge email={email} />
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/email-templates/${email.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                            <span className="sr-only">View email</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}

                {(!emailsSuccess || emails.length === 0) && (
                  <div className="text-center py-4 text-muted-foreground">No recent emails found</div>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" asChild>
                  <Link href="/email-templates">View all emails</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
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