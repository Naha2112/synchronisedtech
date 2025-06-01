import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Eye, MoreHorizontal, Plus, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getInvoices } from "../../actions/invoices"
import { formatCurrency } from "@/lib/utils"
import { FormatCurrency } from "@/components/format-currency"
import { InvoicePdfButton } from "@/components/invoice-pdf-button"
import { MarkAsPaidMenuItem, SendReminderMenuItem } from "@/components/invoice-action-buttons"

// Define date format constants to ensure consistency
const DATE_FORMAT = "MMM d, yyyy"

// Function to safely format dates with the same output on both server and client
function safeFormatDate(dateString: string) {
  try {
    // Parse the date but return the ISO string representation which is stable
    const date = new Date(dateString);
    
    // Format the date string safely
    if (isNaN(date.getTime())) {
      return dateString; // Fall back to the original string if invalid
    }
    
    // Use format with explicit pattern that matches both client and server
    return format(date, DATE_FORMAT);
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString;
  }
}

// Component to display invoice status with appropriate badge styling
function InvoiceStatusBadge({ status }: { status: string }) {
  // Get appropriate styles based on status
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "sent":
      case "viewed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Format the display text (capitalize first letter)
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles()}`}>
      {displayStatus}
    </span>
  );
}

// PDF download menu item - client component
function PdfDownloadMenuItem({ invoice }: { invoice: any }) {
  return (
    <DropdownMenuItem asChild>
      <InvoicePdfButton 
        invoice={invoice}
        variant="ghost"
        className="w-full cursor-pointer justify-start px-2 py-1.5"
      />
    </DropdownMenuItem>
  );
}

export default async function InvoicesPage() {
  // Fetch invoices with error handling
  const { success, invoices = [], message } = await getInvoices();

  // If failed to fetch invoices, display error
  if (!success) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle>Error Loading Invoices</CardTitle>
            <CardDescription>
              There was a problem fetching your invoices. Please try again later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{message || "Unknown error occurred"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and track your client invoices
          </p>
        </div>
        <Button asChild>
          <Link href="/autoflow/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Invoices Overview</CardTitle>
          <CardDescription>
            View and manage all your invoices in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 md:w-1/3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="flex-1" />
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Select defaultValue="all">
                <SelectTrigger className="md:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="newest">
                <SelectTrigger className="md:w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="highest">Highest amount</SelectItem>
                  <SelectItem value="lowest">Lowest amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

            {invoices.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Invoice</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice: any) => {
                      const formattedDate = safeFormatDate(invoice.issue_date);
                      return (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                          <TableCell>
                            <div className="font-medium">{invoice.client_name}</div>
                            <div className="text-sm text-muted-foreground">{invoice.client_email}</div>
                          </TableCell>
                          <TableCell>{formattedDate}</TableCell>
                          <TableCell><FormatCurrency amount={Number(invoice.total)} /></TableCell>
                          <TableCell>
                            <InvoiceStatusBadge status={invoice.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/autoflow/invoices/${invoice.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <PdfDownloadMenuItem invoice={invoice} />
                                <DropdownMenuSeparator />
                                <SendReminderMenuItem invoiceId={invoice.id} />
                                {invoice.status !== "paid" && (
                                  <MarkAsPaidMenuItem invoiceId={invoice.id} />
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <h3 className="mb-2 text-lg font-medium">No invoices yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Get started by creating your first invoice
                </p>
                <Button asChild>
                  <Link href="/autoflow/invoices/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Invoice
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
}
