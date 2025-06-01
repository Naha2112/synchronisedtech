import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { getWorkflows, type Workflow } from '@/app/autoflow/actions/workflows'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Automation | AutoFlow',
}

function WorkflowsList() {
  async function WorkflowsData() {
    // Use a default user ID (1) since no authentication is required
    const userId = 1;
    
    const { success, workflows, message } = await getWorkflows(userId);

    if (!success) {
      return <div className="text-destructive">Error loading workflows: {message}</div>
    }

    if (!workflows || workflows.length === 0) {
      return (
        <div className="text-center p-8">
          <h3 className="text-xl font-semibold mb-2">No workflows found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first workflow to automate your business processes
          </p>
          <Link href="/autoflow/automation/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <Link href={`/autoflow/automation/${workflow.id}`} key={workflow.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <Badge variant={workflow.is_active ? "default" : "outline"}>
                    {workflow.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {workflow.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trigger:</span>
                    <span className="font-medium">
                      {workflow.trigger_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>
                      {formatDistanceToNow(new Date(workflow.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )
  }
  
  return (
    <Suspense fallback={<WorkflowsListSkeleton />}>
      <WorkflowsData />
    </Suspense>
  )
}

function WorkflowsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(6).fill(0).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-3/4 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function AutomationPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automation</h1>
          <p className="text-muted-foreground">
            Automate your business processes and communications
          </p>
        </div>
        <Link href="/autoflow/automation/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Workflows</h2>
        <WorkflowsList />
      </div>
    </div>
  )
}
