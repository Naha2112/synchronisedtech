"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { getClients } from "@/app/autoflow/actions/clients"
import { createInvoice } from "@/app/autoflow/actions/invoices"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn, formatCurrency } from "@/lib/utils"
import { useCurrency } from "@/components/currency-provider"
import { useSettingsStore } from "@/lib/settings-store"
import { FormatCurrency } from "@/components/format-currency"

type ClientType = {
  id: number
  name: string
  email: string
}

// Simple invoice number generator
const generateInvoiceNumber = () => {
  return `INV-${Date.now().toString().slice(-6)}`
}

export default function NewInvoicePage() {
  const router = useRouter()
  const { currency } = useCurrency()
  const { defaultCurrency, defaultPaymentTerms } = useSettingsStore()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  )
  const [clients, setClients] = useState<ClientType[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, amount: 0 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState("gbp") // Default to GBP

  // Update selectedCurrency when defaultCurrency changes
  useEffect(() => {
    setSelectedCurrency(defaultCurrency.toLowerCase())
  }, [defaultCurrency])

  useEffect(() => {
    // Generate dynamic invoice number on component mount
    setInvoiceNumber(generateInvoiceNumber())

    async function fetchClients() {
      try {
        const result = await getClients()
        if (result.success && result.clients) {
          setClients(result.clients as ClientType[])
        }
      } catch (error) {
        console.error("Failed to fetch clients:", error)
      }
    }

    fetchClients()
  }, [])

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Calculate amount if quantity or rate changes
    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }

    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount, 0)
  }

  const regenerateInvoiceNumber = () => {
    setInvoiceNumber(generateInvoiceNumber())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!selectedClient || selectedClient === "" || selectedClient === "add_new") {
      setError("Please select a client")
      setIsSubmitting(false)
      return
    }

    if (!invoiceNumber.trim()) {
      setError("Please provide an invoice number")
      setIsSubmitting(false)
      return
    }

    if (items.length === 0 || items.every(item => !item.description.trim())) {
      setError("Please add at least one item with a description")
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare data for creating invoice
      const subtotal = calculateTotal()
      const taxRate = 0 // Hardcoded for simplicity
      const taxAmount = subtotal * (taxRate / 100)
      const total = subtotal + taxAmount

      const result = await createInvoice({
        invoice_number: invoiceNumber,
        client_id: parseInt(selectedClient),
        issue_date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        notes: (document.getElementById("notes") as HTMLTextAreaElement)?.value,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }))
      })

      if (result.success) {
        // Redirect to invoice page
        router.push("/autoflow/invoices")
      } else {
        setError(result.message || "Failed to create invoice")
      }
    } catch (err) {
      console.error("Error creating invoice:", err)
      setError("An error occurred while creating the invoice")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Create New Invoice</h1>
            <p className="text-muted-foreground">Generate a professional invoice for your clients</p>
          </div>
          <div className="flex gap-2">
            <Link href="/autoflow/invoices">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Invoice Details</TabsTrigger>
            <TabsTrigger value="items">Items & Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Information</CardTitle>
                  <CardDescription>Basic invoice details and numbering</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="invoice-number">Invoice Number</Label>
                    <div className="flex gap-2">
                      <Input
                        id="invoice-number"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder="INV-001"
                        required
                      />
                      <Button type="button" variant="outline" onClick={regenerateInvoiceNumber}>
                        Generate
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Unique identifier for this invoice
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 grid-cols-2">
                    <div>
                      <Label>Issue Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dueDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dueDate}
                            onSelect={setDueDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Client Selection</CardTitle>
                  <CardDescription>Choose the client for this invoice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="client">Client</Label>
                    <Select value={selectedClient} onValueChange={setSelectedClient} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            <div>
                              <div className="font-medium">{client.name}</div>
                              <div className="text-sm text-muted-foreground">{client.email}</div>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="add_new">
                          <div className="flex items-center">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New Client
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {clients.length === 0 && (
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">No clients found</p>
                      <Link href="/autoflow/clients/new">
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Client
                        </Button>
                      </Link>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional notes or payment terms..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
                <CardDescription>Add products or services to this invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid gap-4 md:grid-cols-[2fr,1fr,1fr,1fr,auto] items-end p-4 border rounded-lg">
                      <div>
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Input
                          id={`description-${index}`}
                          value={item.description}
                          onChange={(e) => updateItem(index, "description", e.target.value)}
                          placeholder="Product or service description"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          id={`quantity-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`rate-${index}`}>Rate</Label>
                        <Input
                          id={`rate-${index}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label>Amount</Label>
                        <div className="text-lg font-medium mt-2">
                          <FormatCurrency amount={item.amount} />
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button type="button" variant="outline" onClick={addItem} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>

                  <div className="border-t pt-4">
                    <div className="flex justify-end">
                      <div className="space-y-2 min-w-48">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <FormatCurrency amount={calculateTotal()} />
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (0%):</span>
                          <FormatCurrency amount={0} />
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <FormatCurrency amount={calculateTotal()} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2">
          <Link href="/autoflow/invoices">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
        </div>
      </form>
    </div>
  )
}
