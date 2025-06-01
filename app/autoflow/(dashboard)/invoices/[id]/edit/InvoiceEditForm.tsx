"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getInvoice, updateInvoice } from "@/app/autoflow/actions/invoices"
import { getClients } from "@/app/autoflow/actions/clients"
import { notFound } from "next/navigation"
import { FormatCurrency } from "@/components/format-currency"
import { useCurrency } from "@/components/currency-provider"

type ClientType = {
  id: number;
  name: string;
  email: string;
};

type InvoiceItemType = {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
};

// Load invoice data from the server
async function getInvoiceData(id: number) {
  const { success, invoice } = await getInvoice(id);
  if (!success || !invoice) {
    return null;
  }
  return invoice;
}

export default function InvoiceEditForm({ id: idString }: { id: string }) {
  const router = useRouter();
  
  // Get ID from params safely
  const id = parseInt(idString, 10);

  const [date, setDate] = useState<Date | undefined>();
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [clients, setClients] = useState<ClientType[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [items, setItems] = useState<InvoiceItemType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("draft");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch invoice data
    async function fetchInvoiceData() {
      try {
        const data = await getInvoiceData(id);
        if (!data) {
          setError("Invoice not found");
          return;
        }

        // Set invoice data
        setInvoiceNumber(data.invoice_number);
        setDate(new Date(data.issue_date));
        setDueDate(new Date(data.due_date));
        setSelectedClient(data.client_id.toString());
        setItems(data.items || []);
        setNotes(data.notes || "");
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError("Failed to load invoice");
      } finally {
        setIsLoading(false);
      }
    }

    // Fetch clients
    async function fetchClients() {
      try {
        const result = await getClients();
        if (result.success && result.clients) {
          setClients(result.clients as ClientType[]);
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    }

    if (isNaN(id)) {
      router.push("/autoflow/invoices");
    } else {
      fetchInvoiceData();
      fetchClients();
    }
  }, [id, router]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Calculate amount if quantity or rate changes
    if (field === "quantity" || field === "rate") {
      const quantity = Number(newItems[index].quantity || 0);
      const rate = Number(newItems[index].rate || 0);
      newItems[index].amount = quantity * rate;
    }

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + Number(item.amount || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!selectedClient || selectedClient === "") {
      setError("Please select a client");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare data for updating invoice
      const subtotal = calculateTotal();
      const taxRate = 0; // Hardcoded for simplicity
      const taxAmount = subtotal * (taxRate / 100);
      const total = subtotal + taxAmount;

      const result = await updateInvoice(id, {
        invoice_number: invoiceNumber,
        client_id: parseInt(selectedClient),
        issue_date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        status: status as any, 
        notes,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }))
      });

      if (result.success) {
        // Redirect to invoice page
        router.push(`/autoflow/invoices/${id}`);
      } else {
        setError(result.message || "Failed to update invoice");
      }
    } catch (err) {
      console.error("Error updating invoice:", err);
      setError("An error occurred while updating the invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-160px)]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Edit Invoice #{invoiceNumber}</h1>
        <Button variant="outline" asChild>
          <Link href={`/autoflow/invoices/${id}`}>Cancel</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Invoice Details</TabsTrigger>
            <TabsTrigger value="items">Line Items</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Information</CardTitle>
                <CardDescription>Update the basic details for this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <Input 
                      id="invoice-number" 
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient}>
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Invoice Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes for this invoice"
                    className="min-h-[100px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>Add or remove items from this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-10 px-4 text-left align-middle font-medium">Description</th>
                        <th className="h-10 px-2 text-center align-middle font-medium w-[100px]">Quantity</th>
                        <th className="h-10 px-2 text-right align-middle font-medium w-[100px]">Rate</th>
                        <th className="h-10 px-2 text-right align-middle font-medium w-[100px]">Amount</th>
                        <th className="h-10 px-2 text-center align-middle font-medium w-[80px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-2">
                            <Input 
                              placeholder="Item description" 
                              value={item.description}
                              onChange={(e) => updateItem(index, "description", e.target.value)}
                            />
                          </td>
                          <td className="p-2">
                            <Input 
                              type="number" 
                              min="1" 
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                            />
                          </td>
                          <td className="p-2">
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={item.rate}
                              onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value))}
                            />
                          </td>
                          <td className="p-2 text-right align-middle">
                            <FormatCurrency amount={Number(item.amount || 0)} />
                          </td>
                          <td className="p-2 text-center">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeItem(index)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="mt-2" 
                  onClick={addItem}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>

                <div className="rounded-md border p-4 mt-4">
                  <div className="flex justify-between py-2">
                    <span>Subtotal</span>
                    <span><FormatCurrency amount={Number(calculateTotal())} /></span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax (0%)</span>
                    <span><FormatCurrency amount={0} /></span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total</span>
                    <span><FormatCurrency amount={Number(calculateTotal())} /></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>Configure additional settings for this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd" disabled>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound (£)</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar (C$)</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar (A$)</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Currency cannot be changed after invoice creation.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href={`/autoflow/invoices/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
} 