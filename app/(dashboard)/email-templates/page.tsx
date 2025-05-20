import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Edit, Eye, MoreHorizontal, Plus, Search, Send } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEmailTemplates, type EmailTemplate } from "@/app/actions/email-templates"
import SendTestEmailDropdownItem from "./send-test-email-dropdown-item"

export default async function EmailTemplatesPage() {
  // Fetch email templates with error handling
  const { success = false, templates = [] } = await getEmailTemplates()
    .catch(() => ({ success: false, templates: [] }));

  // Cast templates to the correct type and ensure it's an array
  const emailTemplates = (Array.isArray(templates) ? templates : []) as EmailTemplate[];

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Email Templates</h1>
        <Button asChild>
          <Link href="/email-templates/new">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Templates</CardTitle>
            <CardDescription>Manage your email templates for automation</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search templates..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="confirmation">Confirmation</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {emailTemplates.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {emailTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">TPL-{String(template.id).padStart(3, '0')}</TableCell>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.type}</TableCell>
                        <TableCell>{format(new Date(template.updated_at), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <TemplateStatusBadge status={template.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/email-templates/${template.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/email-templates/${template.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <SendTestEmailDropdownItem templateId={template.id} />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="mt-4 text-lg font-semibold">No Email Templates Found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  You haven't created any email templates yet. Get started by creating your first template.
                </p>
                <Button asChild>
                  <Link href="/email-templates/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Template
                  </Link>
                </Button>
              </div>
            )}

            {emailTemplates.length > 0 && (
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TemplateStatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusStyles(status)}`}>{displayStatus}</span>
}
