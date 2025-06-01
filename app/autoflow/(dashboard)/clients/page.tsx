import Link from "next/link"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { getClients } from "@/app/autoflow/actions/clients"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Client = {
  id: number
  name: string
  email: string
  phone: string | null
  created_at: string
}

type ClientsResponse = {
  success: boolean
  clients: Client[]
  message?: string
}

export default async function ClientsPage() {
  const { success, clients, message } = await getClients() as ClientsResponse;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Link href="/autoflow/clients/new">
          <Button>Create Client</Button>
        </Link>
      </div>
      {!success ? (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-destructive">{message || "Failed to load clients."}</div>
          </CardContent>
        </Card>
      ) : clients.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Clients Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">You haven't added any clients yet.</div>
            <Link href="/autoflow/clients/new">
              <Button>Create Your First Client</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-3">Name</th>
                <th className="text-left pb-3">Email</th>
                <th className="text-left pb-3">Phone</th>
                <th className="text-left pb-3">Created</th>
                <th className="text-left pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client: Client) => (
                <tr key={client.id} className="border-b">
                  <td className="py-3">{client.name}</td>
                  <td className="py-3">{client.email}</td>
                  <td className="py-3">{client.phone || <span className="text-muted-foreground">N/A</span>}</td>
                  <td className="py-3">{format(new Date(client.created_at), "PPP")}</td>
                  <td className="py-3 flex gap-2">
                    <Link href={`/autoflow/clients/${client.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Link href={`/autoflow/clients/${client.id}/edit`}>
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 