"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, Edit, Eye, MoreHorizontal, Plus, Search, Send, CalendarClock, Crown, Star, Sparkles } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEmailTemplates, type EmailTemplate } from "@/app/autoflow/actions/email-templates"
import SendTestEmailDropdownItem from "./send-test-email-dropdown-item"
import DeleteEmailTemplateDropdownItem from "./delete-email-template-dropdown-item"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

// Status badge component
function TemplateStatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Active</span>
  }
  return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Draft</span>
}

export default function EmailTemplatesPage() {
  const searchParams = useSearchParams()
  const isFromSchedule = searchParams.get('fromSchedule') === 'true'
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(true)
  
  const loadTemplates = async () => {
    setLoading(true)
    try {
      const { success = false, templates = [] } = await getEmailTemplates();
      // Cast templates to the correct type and ensure it's an array
      setTemplates(Array.isArray(templates) ? templates as EmailTemplate[] : []);
    } catch (error) {
      console.error("Error loading templates:", error);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    loadTemplates();
  }, []);

  const handleTemplateDeleted = () => {
    loadTemplates();
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Email Templates</h1>
          <p className="text-muted-foreground">Manage your email templates</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/autoflow/email-templates/professional">
              <Crown className="mr-2 h-4 w-4 text-purple-500" />
              Professional Suite
            </Link>
          </Button>
          <Button asChild>
            <Link href="/autoflow/email-templates/new">
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Link>
          </Button>
        </div>
      </div>

      {/* Professional Templates Feature Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 dark:from-purple-950/20 dark:to-blue-950/20 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
            <Crown className="w-5 h-5" />
            Professional Email Templates
            <div className="flex items-center gap-1 ml-auto">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Premium</span>
            </div>
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-400">
            Industry-grade templates designed to position your services as premium and command higher payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <span>8 Professional Templates</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-green-500" />
                  <span>94% Faster Payments</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown className="w-4 h-4 text-purple-500" />
                  <span>Premium Positioning</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Includes invoice delivery, payment reminders, client onboarding, and project completion templates
              </p>
            </div>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shrink-0">
              <Link href="/autoflow/email-templates/professional">
                <Crown className="mr-2 h-4 w-4" />
                Explore Professional Suite
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add scheduling guidance */}
      {isFromSchedule && (
        <div className="mb-4 rounded-md bg-blue-50 p-4 text-blue-800">
          <h3 className="text-lg font-medium">Schedule an Email</h3>
          <p className="mt-1">
            Select a template below to schedule it for sending at a later time.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Email Templates</CardTitle>
          <CardDescription>
            View and manage all your email templates
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading templates...</p>
            </div>
          ) : (
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

              {templates.length > 0 ? (
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
                      {templates.map((template) => (
                        <TableRow 
                          key={template.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => window.location.href = `/autoflow/email-templates/${template.id}`}
                        >
                          <TableCell className="font-medium">TPL-{String(template.id).padStart(3, '0')}</TableCell>
                          <TableCell>
                            <Link href={`/autoflow/email-templates/${template.id}`} className="text-blue-600 hover:underline">
                              {template.name}
                            </Link>
                          </TableCell>
                          <TableCell>{template.type}</TableCell>
                          <TableCell>{format(new Date(template.updated_at), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <TemplateStatusBadge status={template.status} />
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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
                                  <Link href={`/autoflow/email-templates/${template.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/autoflow/email-templates/${template.id}`} className="flex items-center">
                                    <CalendarClock className="mr-2 h-4 w-4" />
                                    Schedule Email
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/autoflow/email-templates/${template.id}/edit`}>
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
                                <DropdownMenuSeparator />
                                <DeleteEmailTemplateDropdownItem 
                                  templateId={template.id} 
                                  templateName={template.name}
                                  onDeleted={handleTemplateDeleted}
                                />
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
                    <Link href="/autoflow/email-templates/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Template
                    </Link>
                  </Button>
                </div>
              )}

              {templates.length > 0 && (
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
