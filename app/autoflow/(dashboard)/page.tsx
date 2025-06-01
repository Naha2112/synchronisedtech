import { redirect } from "next/navigation"
import { getDashboardStats } from "@/app/autoflow/actions/invoices"
import { TrendingUp, FileText, Clock, DollarSign, Users, AlertCircle, Sparkles, BarChart3 } from "lucide-react"

// Dashboard page with server actions
export default async function Dashboard() {
  try {
    // Get dashboard stats
    const result = await getDashboardStats()
    
    if (!result.success || !result.stats) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">Dashboard</h1>
            <div className="bg-gradient-to-r from-red-500/10 to-red-600/5 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-3" />
                <p>Failed to load dashboard data: {result.message}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    const stats = result.stats
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950/30 via-gray-950/30 to-slate-900/30 text-white p-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl border border-blue-500/30">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Welcome back! Here's your business overview.
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center border border-green-500/30">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white mb-1">${stats.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 font-medium">Total Revenue</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                  <p className="text-sm text-green-400 font-medium">All time earnings</p>
                </div>
              </div>
            </div>
            
            {/* Pending Invoices Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white mb-1">{stats.pendingInvoices.count}</p>
                    <p className="text-xs text-gray-400 font-medium">Pending Invoices</p>
                  </div>
                </div>
                <p className="text-sm text-blue-400 font-medium">${stats.pendingInvoices.total.toFixed(2)} awaiting payment</p>
              </div>
            </div>
            
            {/* Paid Invoices Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-xl flex items-center justify-center border border-emerald-500/30">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white mb-1">{stats.paidInvoices.count}</p>
                    <p className="text-xs text-gray-400 font-medium">Paid (30 days)</p>
                  </div>
                </div>
                <p className="text-sm text-emerald-400 font-medium">${stats.paidInvoices.total.toFixed(2)} received</p>
              </div>
            </div>
            
            {/* Overdue Invoices Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-xl flex items-center justify-center border border-red-500/30">
                    <Clock className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white mb-1">{stats.overdueInvoices.count}</p>
                    <p className="text-xs text-gray-400 font-medium">Overdue Invoices</p>
                  </div>
                </div>
                <p className="text-sm text-red-400 font-medium">${stats.overdueInvoices.total.toFixed(2)} overdue</p>
              </div>
            </div>
          </div>
          
          {/* Recent Invoices */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-xl rounded-3xl border border-gray-700/50 overflow-hidden hover:border-blue-500/30 transition-all duration-500">
              {/* Header */}
              <div className="p-6 border-b border-gray-700/30 bg-gradient-to-r from-gray-800/30 to-gray-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl flex items-center justify-center border border-blue-500/30">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Recent Invoices</h2>
                      <p className="text-sm text-gray-400">Latest billing activity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-400 font-medium">Live</span>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {stats.recentInvoices.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700/30">
                          <th className="text-left pb-4 text-gray-400 font-semibold text-sm">Invoice #</th>
                          <th className="text-left pb-4 text-gray-400 font-semibold text-sm">Client</th>
                          <th className="text-left pb-4 text-gray-400 font-semibold text-sm">Amount</th>
                          <th className="text-left pb-4 text-gray-400 font-semibold text-sm">Status</th>
                          <th className="text-left pb-4 text-gray-400 font-semibold text-sm">Due Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentInvoices.map((invoice, index) => (
                          <tr key={invoice.id} className={`${index !== stats.recentInvoices.length - 1 ? 'border-b border-gray-800/30' : ''} hover:bg-gradient-to-r hover:from-gray-700/20 hover:to-gray-600/20 transition-all duration-300 group/row`}>
                            <td className="py-4">
                              <span className="text-white font-semibold group-hover/row:text-blue-300 transition-colors">
                                {invoice.invoice_number}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className="text-gray-300 group-hover/row:text-white transition-colors">
                                {invoice.client}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className="text-white font-bold text-lg group-hover/row:text-green-400 transition-colors">
                                ${invoice.amount.toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(invoice.status)}`}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className="text-gray-300 group-hover/row:text-white transition-colors">
                                {formatDate(invoice.due_date)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-600/30 to-gray-700/30 rounded-2xl flex items-center justify-center mx-auto border border-gray-600/50">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-2xl blur opacity-50"></div>
                    </div>
                    <p className="text-gray-400 text-lg font-medium mb-2">No recent invoices found</p>
                    <p className="text-gray-500 text-sm">Create your first invoice to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    return redirect("/autoflow/login")
  }
}

// Helper functions
function getStatusStyle(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-300 border border-green-500/50 shadow-lg shadow-green-500/20'
    case 'sent':
      return 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-300 border border-blue-500/50 shadow-lg shadow-blue-500/20'
    case 'overdue':
      return 'bg-gradient-to-r from-red-500/30 to-pink-500/30 text-red-300 border border-red-500/50 shadow-lg shadow-red-500/20'
    case 'draft':
      return 'bg-gradient-to-r from-gray-500/30 to-slate-500/30 text-gray-300 border border-gray-500/50 shadow-lg shadow-gray-500/20'
    default:
      return 'bg-gradient-to-r from-gray-500/30 to-slate-500/30 text-gray-300 border border-gray-500/50 shadow-lg shadow-gray-500/20'
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
} 