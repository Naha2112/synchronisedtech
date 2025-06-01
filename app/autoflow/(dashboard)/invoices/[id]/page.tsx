import Link from "next/link"
import { ArrowLeft, Pencil, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoice } from "@/app/autoflow/actions/invoices"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { notFound } from "next/navigation"
import { FormatCurrency } from "@/components/format-currency"
import { InvoicePdfButton } from "@/components/invoice-pdf-button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await the params to fix the sync-dynamic-apis error
  const resolvedParams = await params
  
  if (!resolvedParams?.id) {
    return notFound()
  }
  
  const id = parseInt(resolvedParams.id, 10)
  
  if (isNaN(id)) {
    return notFound()
  }

  const result = await getInvoice(id)
  
  if (!result.success || !result.invoice) {
    return notFound()
  }

  const { invoice, items } = result
  const status = invoice.status.toLowerCase()

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h1>
        <Badge 
          variant={
            status === 'paid' ? 'default' : 
            status === 'overdue' ? 'destructive' : 
            status === 'viewed' ? 'secondary' : 
            status === 'sent' ? 'secondary' : 
            'outline'
          }
          className="text-sm"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      
      <Card className="overflow-hidden border-0 shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle className="text-xl">Invoice Details</CardTitle>
              <CardDescription>
                Invoice #{invoice.invoice_number} • {formatDate(new Date(invoice.issue_date))}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/autoflow/invoices/${invoice.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <InvoicePdfButton invoice={invoice} items={items} />
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Invoice
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Bill To</h3>
              <div className="space-y-1 text-gray-600">
                <p className="font-medium text-gray-900">{invoice.client_name}</p>
                <p>{invoice.client_email}</p>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Invoice Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-medium">{formatDate(new Date(invoice.issue_date))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">{formatDate(new Date(invoice.due_date))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={status === 'paid' ? 'default' : status === 'overdue' ? 'destructive' : 'secondary'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Line Items</h3>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Description</TableHead>
                  <TableHead className="text-center font-semibold text-gray-900">Quantity</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Rate</TableHead>
                  <TableHead className="text-right font-semibold text-gray-900">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items && items.map((item: any, index: number) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right"><FormatCurrency amount={Number(item.rate)} /></TableCell>
                    <TableCell className="text-right"><FormatCurrency amount={Number(item.amount)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium"><FormatCurrency amount={Number(invoice.subtotal)} /></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
                <span className="font-medium"><FormatCurrency amount={Number(invoice.tax_amount)} /></span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span><FormatCurrency amount={Number(invoice.total)} /></span>
              </div>
            </div>
          </div>
          
          {invoice.notes && (
            <>
              <Separator className="my-8" />
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Notes</h3>
                <p className="text-gray-600">{invoice.notes}</p>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50 px-8 py-6">
          <div className="flex w-full justify-between">
            <Button variant="outline" asChild>
              <Link href="/autoflow/invoices">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Invoices
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 