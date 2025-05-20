import Link from "next/link"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { getClients } from "@/app/actions/clients"
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
}

export default async function ClientsPage() {
  const { success, clients = [] } = await getClients().catch(() => ({ success: false, clients: [] })) as ClientsResponse;

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-semibold md:text-2xl">Clients</h1>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <CardDescription>Manage your client relationships</CardDescription>
        </CardHeader>
        <CardContent>
          {success && clients.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted p-4 text-sm font-medium">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Phone</div>
                  <div>Created</div>
                  <div></div>
                </div>
                <div className="divide-y">
                  {clients.map((client: Client) => (
                    <div key={client.id} className="grid grid-cols-5 items-center p-4 text-sm">
                      <div className="font-medium">{client.name}</div>
                      <div>{client.email}</div>
                      <div>{client.phone || "—"}</div>
                      <div>{format(new Date(client.created_at), "MMM d, yyyy")}</div>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/clients/${client.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="mt-4 text-lg font-semibold">No Clients Found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You have not created any clients yet. Add your first client to get started.
              </p>
              <Button asChild>
                <Link href="/clients/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 