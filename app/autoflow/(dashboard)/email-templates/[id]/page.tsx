import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { getEmailTemplate, type EmailTemplate } from "@/app/autoflow/actions/email-templates"
import SendTestEmailButton from "./send-test-email-button"
import ScheduleEmailButton from "./schedule-email-button"
import DeleteTemplateButton from "./delete-template-button"
import React from "react"

interface TemplatePageProps {
  params: Promise<{ id: string }>
}

export default async function TemplateDetailsPage({ params }: TemplatePageProps) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  
  if (isNaN(id)) {
    return notFound()
  }

  const { success, template } = await getEmailTemplate(id)

  if (!success || !template) {
    return notFound()
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/autoflow/email-templates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold md:text-2xl">{template.name}</h1>
          <Badge variant={template.status === "active" ? "default" : "secondary"}>
            {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <SendTestEmailButton templateId={template.id} />
          <ScheduleEmailButton templateId={template.id} />
          <Button asChild>
            <Link href={`/autoflow/email-templates/${template.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Template
            </Link>
          </Button>
          <DeleteTemplateButton templateId={template.id} templateName={template.name} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
            <CardDescription>Basic information about this template</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Type</div>
                <div>{template.type}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
                <div>{format(new Date(template.updated_at), "PPP")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Preview</CardTitle>
            <CardDescription>Preview how this email will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4">
              <div className="mb-2 font-semibold">{template.subject}</div>
              <div className="whitespace-pre-wrap">
                {template.body
                  .replace(/{client_name}/g, "John Doe")
                  .replace(/{invoice_number}/g, "INV-001")
                  .replace(/{amount}/g, "$1,234.56")
                  .replace(/{due_date}/g, "Jan 31, 2024")
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 