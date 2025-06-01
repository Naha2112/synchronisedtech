import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getScheduledEmails } from "@/app/autoflow/actions/email-templates"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CalendarClock } from "lucide-react"
import SearchForm from "./search-form"

interface ScheduledEmail {
  id: number
  email_template_id: number
  template_name: string
  recipient: string
  subject: string
  body: string
  scheduled_date: string
  status: 'scheduled' | 'sent' | 'failed'
  sent_date: string | null
}

export default async function ScheduledEmailsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const status = searchParams?.status ? 
    Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status 
    : "all";
    
  const search = searchParams?.search ? 
    Array.isArray(searchParams.search) ? searchParams.search[0] : searchParams.search 
    : "";
  
  const { success, emails } = await getScheduledEmails()
  
  // Filter emails based on search and status
  const filteredEmails = emails
    ? emails.filter((email: ScheduledEmail) => {
        // Status filter
        if (status !== "all" && email.status !== status) {
          return false
        }
        
        // Search filter (recipient or subject)
        if (search && !email.recipient.toLowerCase().includes(search.toLowerCase()) && 
            !email.subject.toLowerCase().includes(search.toLowerCase())) {
          return false
        }
        
        return true
      })
    : []

  // Count emails by status
  const counts = {
    all: emails?.length || 0,
    scheduled: emails?.filter((email: ScheduledEmail) => email.status === "scheduled").length || 0,
    sent: emails?.filter((email: ScheduledEmail) => email.status === "sent").length || 0,
    failed: emails?.filter((email: ScheduledEmail) => email.status === "failed").length || 0,
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Scheduled Emails</h1>
          <p className="text-muted-foreground">View and manage your scheduled emails</p>
        </div>
        <Button asChild>
          <Link href="/autoflow/email-templates?fromSchedule=true">Create New</Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Scheduled Emails</CardTitle>
              <CardDescription>
                View emails scheduled to be sent at a future date
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <SearchForm />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={status} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all" asChild>
                <Link href="/autoflow/scheduled-emails">All ({counts.all})</Link>
              </TabsTrigger>
              <TabsTrigger value="scheduled" asChild>
                <Link href="/autoflow/scheduled-emails?status=scheduled">Scheduled ({counts.scheduled})</Link>
              </TabsTrigger>
              <TabsTrigger value="sent" asChild>
                <Link href="/autoflow/scheduled-emails?status=sent">Sent ({counts.sent})</Link>
              </TabsTrigger>
              <TabsTrigger value="failed" asChild>
                <Link href="/autoflow/scheduled-emails?status=failed">Failed ({counts.failed})</Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={status} className="border-none p-0">
              {success && filteredEmails.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Template</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmails.map((email: ScheduledEmail) => (
                      <TableRow key={email.id}>
                        <TableCell>
                          <div className="font-medium">SE-{String(email.id).padStart(3, '0')}</div>
                        </TableCell>
                        <TableCell>
                          <Link href={`/autoflow/email-templates/${email.email_template_id}`} className="text-blue-600 hover:underline">
                            {email.template_name}
                          </Link>
                        </TableCell>
                        <TableCell>{email.recipient}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {format(new Date(email.scheduled_date), "PPP 'at' p")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              email.status === "sent"
                                ? "default"
                                : email.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {email.status.charAt(0).toUpperCase() + email.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {email.sent_date ? (
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                              {format(new Date(email.sent_date), "PPP 'at' p")}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {email.status === "scheduled" && (
                            <div className="text-sm text-muted-foreground">
                              <span className="text-sm">Soon available</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarClock className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="mb-4 text-muted-foreground">
                    {search ? "No emails match your search criteria." : "You don't have any scheduled emails yet."}
                  </p>
                  <Button asChild>
                    <Link href="/autoflow/email-templates?fromSchedule=true">Create a New Schedule</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 