import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Edit, PlayCircle, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getWorkflow, type Workflow } from "@/app/autoflow/actions/workflows"
import { getWorkflowLogs, WorkflowLog } from '@/app/autoflow/actions/workflow-logs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import WorkflowActions from './workflow-actions'
import { formatDistanceToNow } from 'date-fns'

interface WorkflowPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: 'Workflow Details | AutoFlow',
}

async function WorkflowContent({ id }: { id: number }) {
  const { success, workflow, message } = await getWorkflow(id)

  if (!success || !workflow) {
    return notFound()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/autoflow/automation">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{workflow.name}</h1>
              <Badge variant={workflow.is_active ? "default" : "outline"}>
                {workflow.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {workflow.description}
            </p>
          </div>
        </div>
        <WorkflowActions id={id} isActive={workflow.is_active} />
      </div>

      <Tabs defaultValue="details" className="mb-8">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="history">Execution History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Trigger</CardTitle>
                <CardDescription>What starts this workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-medium">
                  {workflow.trigger_type.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Steps</CardTitle>
                <CardDescription>The sequence of actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-medium">
                  {workflow.steps?.length || 0} steps
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Created</CardTitle>
                <CardDescription>When this workflow was created</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-medium">
                  {new Date(workflow.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Workflow Steps</h2>
            {workflow.steps && workflow.steps.length > 0 ? (
              <div className="space-y-4">
                {workflow.steps.map((step) => (
                  <Card key={step.id}>
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 rounded-full p-3 text-primary">
                          <div className="font-bold">{step.step_order}</div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {step.action_type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </div>
                          <div className="text-muted-foreground mt-1">
                            {renderActionDescription(step)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6">
                  <div className="text-center text-muted-foreground">
                    No steps defined for this workflow.
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <WorkflowHistory id={id} />
        </TabsContent>
      </Tabs>
    </>
  )
}

// Helper to render step description based on action type
function renderActionDescription(step: any) {
  const actionData = typeof step.action_data === 'string' ? 
    JSON.parse(step.action_data) : step.action_data

  switch (step.action_type) {
    case 'send_email':
      return `Send email template ${actionData.template_id || 'unknown'}`
    case 'wait':
      return `Wait for ${actionData.days || 'unknown'} days`
    case 'update_status':
      return `Update status to "${actionData.status || 'unknown'}"`
    case 'notify':
      return `Send notification: "${actionData.message ? 
        (actionData.message.length > 50 ? 
          actionData.message.substring(0, 50) + '...' : 
          actionData.message) : 
        'No message'}"` 
    default:
      return 'Unknown action'
  }
}

// New component for workflow history
async function WorkflowHistory({ id }: { id: number }) {
  const { success, logs } = await getWorkflowLogs(id)
  
  if (!success || !logs || logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-muted-foreground">
            No execution history available for this workflow.
          </div>
        </CardContent>
      </Card>
    )
  }
  
  // Group logs by date
  const groupedLogs: Record<string, WorkflowLog[]> = {}
  logs.forEach((log: WorkflowLog) => {
    const date = new Date(log.created_at).toDateString()
    if (!groupedLogs[date]) {
      groupedLogs[date] = []
    }
    groupedLogs[date].push(log)
  })
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedLogs).map(([date, dateLogs]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
          <div className="space-y-3">
            {dateLogs.map((log: WorkflowLog) => (
              <Card key={log.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    {log.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : log.status === 'failure' ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <p className="text-sm mt-1">{log.message}</p>
                      {log.step_id && (
                        <Badge variant="outline" className="mt-2">Step ID: {log.step_id}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function WorkflowSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/autoflow/automation">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-52" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-80 mt-2" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-40 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6 pb-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id)
  
  if (isNaN(id)) {
    return notFound()
  }

  return (
    <div className="container py-6">
      <Suspense fallback={<WorkflowSkeleton />}>
        <WorkflowContent id={id} />
      </Suspense>
    </div>
  )
} 