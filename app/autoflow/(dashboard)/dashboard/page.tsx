import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  return <DashboardClient />
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
