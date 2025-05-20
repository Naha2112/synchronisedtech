"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getClient, updateClient, deleteClient } from "@/app/actions/clients"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === 'string' ? parseInt(params.id) : 0
  
  const [client, setClient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function loadClient() {
      try {
        const result = await getClient(id)
        if (result.success) {
          setClient(result.client)
        } else {
          setError("Client not found")
        }
      } catch (err) {
        setError("Failed to load client")
      } finally {
        setIsLoading(false)
      }
    }

    loadClient()
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string

    try {
      const result = await updateClient(id, {
        name,
        email,
        phone: phone || undefined,
        address: address || undefined,
      })

      if (result.success) {
        setSuccess("Client updated successfully!")
      } else {
        setError(result.message || "Failed to update client")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this client?")) {
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      const result = await deleteClient(id)
      if (result.success) {
        router.push("/clients")
      } else {
        setError(result.message || "Failed to delete client")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold md:text-2xl">Client Details</h1>
        </div>
        <div className="flex justify-center p-12">Loading...</div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold md:text-2xl">Client Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="mb-4">The client you're looking for doesn't exist or you don't have access to it.</p>
              <Button asChild>
                <Link href="/clients">Back to Clients</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Client Details</h1>
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete Client"}
        </Button>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Edit Client</CardTitle>
            <CardDescription>Update client information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 text-green-700 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={client.name} placeholder="Client name" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={client.email} placeholder="client@example.com" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={client.phone || ""} placeholder="(123) 456-7890" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" name="address" defaultValue={client.address || ""} placeholder="Client address" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/clients">Back</Link>
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
} 