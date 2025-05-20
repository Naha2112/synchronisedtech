"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getEmailTemplate, updateEmailTemplate } from "@/app/actions/email-templates"

interface EditTemplatePageProps {
  params: { id: string }
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const router = useRouter()
  const id = parseInt(params.id)
  
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState<"draft" | "active">("draft")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchTemplate() {
      if (isNaN(id)) {
        return router.push('/email-templates')
      }

      try {
        const { success, template } = await getEmailTemplate(id)
        
        if (!success || !template) {
          return router.push('/email-templates')
        }

        setName(template.name)
        setSubject(template.subject)
        setBody(template.body)
        setType(template.type)
        setStatus(template.status)
      } catch (error) {
        console.error("Error fetching template:", error)
        setError("Failed to load template")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplate()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!name || !subject || !body || !type) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      const result = await updateEmailTemplate(id, {
        name,
        subject,
        body,
        type,
        status
      })

      if (result.success) {
        // Redirect to template details page
        router.push(`/email-templates/${id}`)
      } else {
        setError(result.message || "Failed to update email template")
      }
    } catch (err) {
      console.error("Error updating email template:", err)
      setError("An error occurred while updating the template")
    } finally {
      setIsSubmitting(false)
    }
  }

  const templateTypes = [
    { value: "welcome", label: "Welcome" },
    { value: "reminder", label: "Reminder" },
    { value: "confirmation", label: "Confirmation" },
    { value: "notification", label: "Notification" },
    { value: "marketing", label: "Marketing" },
    { value: "newsletter", label: "Newsletter" },
    { value: "other", label: "Other" }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 md:p-8">
        <p>Loading template...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Edit Email Template</h1>
        <Button variant="outline" asChild>
          <Link href={`/email-templates/${id}`}>Cancel</Link>
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
            <TabsTrigger value="details">Template Details</TabsTrigger>
            <TabsTrigger value="content">Email Content</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Template Information</CardTitle>
                <CardDescription>Update the basic details for this email template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input 
                    id="name"
                    placeholder="e.g., Invoice Payment Reminder"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Template Type</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        {templateTypes.map((templateType) => (
                          <SelectItem key={templateType.value} value={templateType.value}>
                            {templateType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value: "draft" | "active") => setStatus(value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Email Content</CardTitle>
                <CardDescription>Customize the content of your email template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="e.g., Your Invoice Is Due"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Email Body</Label>
                  <div className="text-sm text-muted-foreground mb-2">
                    Use {"{client_name}"}, {"{invoice_number}"}, {"{amount}"}, {"{due_date}"} as placeholders.
                  </div>
                  <Textarea
                    id="body"
                    placeholder="Enter the content of your email template"
                    className="min-h-[300px] font-mono"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <CardDescription>Preview how your email will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4">
                  <div className="mb-2 font-semibold">{subject || "No subject provided"}</div>
                  <div className="whitespace-pre-wrap">
                    {body 
                      ? body
                          .replace(/{client_name}/g, "John Doe")
                          .replace(/{invoice_number}/g, "INV-001")
                          .replace(/{amount}/g, "$1,234.56")
                          .replace(/{due_date}/g, "Jan 31, 2024")
                      : "No content provided"
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" asChild>
            <Link href={`/email-templates/${id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 