import { notFound } from "next/navigation";
import { getClient } from "@/app/autoflow/actions/clients";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);
  if (isNaN(clientId)) return notFound();

  const { success, client, message } = await getClient(clientId);

  if (!success || !client) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Client Not Found</CardTitle>
            <CardDescription>{message || "No client found with this ID."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/autoflow/clients">
              <Button variant="outline">Back to Clients</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">Client Details</p>
        </div>
        <Link href={`/autoflow/clients/${client.id}/edit`}>
          <Button>Edit Client</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><span className="font-medium">Email:</span> {client.email || <span className="text-muted-foreground">N/A</span>}</div>
              <div><span className="font-medium">Phone:</span> {client.phone || <span className="text-muted-foreground">N/A</span>}</div>
              <div><span className="font-medium">Created:</span> {format(new Date(client.created_at), "PPP")}</div>
            </div>
          </CardContent>
        </Card>
        {/* Add more cards for address, notes, etc. if available */}
      </div>

      {/* Invoices Section (if available) */}
      {client.invoices && client.invoices.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Invoices</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-3">Invoice #</th>
                  <th className="text-left pb-3">Amount</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-left pb-3">Due Date</th>
                  <th className="text-left pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {client.invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="py-3">{invoice.invoice_number}</td>
                    <td className="py-3">${invoice.total?.toFixed(2) ?? "-"}</td>
                    <td className="py-3">{invoice.status}</td>
                    <td className="py-3">{invoice.due_date ? format(new Date(invoice.due_date), "PPP") : "-"}</td>
                    <td className="py-3">
                      <Link href={`/autoflow/invoices/${invoice.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add more sections for notes, activity, etc. as needed */}
    </div>
  );
} 