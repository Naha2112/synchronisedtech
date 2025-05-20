import { redirect } from "next/navigation"
import { getDashboardStats } from "@/app/actions/invoices"

// Dashboard page with server actions
export default async function Dashboard() {
  try {
    // Get dashboard stats
    const result = await getDashboardStats()
    
    if (!result.success) {
      return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Failed to load dashboard data: {result.message}</p>
          </div>
        </div>
      )
    }
    
    const { stats } = result
    
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h2>
            <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Invoices</h2>
            <p className="text-3xl font-bold">{stats.pendingInvoices.count}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">${stats.pendingInvoices.total.toFixed(2)}</p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Invoices Paid (30 days)</h2>
            <p className="text-3xl font-bold">{stats.paidInvoices.count}</p>
          </div>
          
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Invoices</h2>
            <p className="text-3xl font-bold">{stats.overdueInvoices.count}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">${stats.overdueInvoices.total.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-4">Recent Invoices</h2>
          {stats.recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3">Invoice #</th>
                    <th className="text-left pb-3">Client</th>
                    <th className="text-left pb-3">Amount</th>
                    <th className="text-left pb-3">Status</th>
                    <th className="text-left pb-3">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="py-3">{invoice.invoice_number}</td>
                      <td className="py-3">{invoice.client}</td>
                      <td className="py-3">${invoice.amount.toFixed(2)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(invoice.status)}`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3">{formatDate(invoice.due_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent invoices found.</p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    return redirect("/login")
  }
}

// Helper functions
function getStatusColor(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800'
    case 'sent':
      return 'bg-blue-100 text-blue-800'
    case 'overdue':
      return 'bg-red-100 text-red-800'
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
} 