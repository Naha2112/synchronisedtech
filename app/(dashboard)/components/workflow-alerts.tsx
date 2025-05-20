'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, X } from 'lucide-react'
import { getRecentLogs, WorkflowLog } from '@/app/actions/workflow-logs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

export function WorkflowAlerts() {
  const [failedWorkflows, setFailedWorkflows] = useState<WorkflowLog[]>([])
  const [dismissed, setDismissed] = useState<Record<number, boolean>>({})
  
  useEffect(() => {
    const fetchFailedWorkflows = async () => {
      const { success, logs } = await getRecentLogs(20)
      if (success && logs) {
        // Get only failure logs
        const failures = logs.filter(log => 
          log.status === 'failure' && !dismissed[log.id]
        )
        setFailedWorkflows(failures)
      }
    }
    
    fetchFailedWorkflows()
    
    // Set up periodic refresh
    const interval = setInterval(fetchFailedWorkflows, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [dismissed])
  
  if (!failedWorkflows.length) {
    return null
  }
  
  const dismissAlert = (id: number) => {
    setDismissed(prev => ({ ...prev, [id]: true }))
  }
  
  return (
    <div className="space-y-2 mb-6">
      {failedWorkflows.slice(0, 3).map(log => (
        <Alert variant="destructive" key={log.id} className="relative">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center">
            Workflow Failure
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 absolute right-2 top-2"
              onClick={() => dismissAlert(log.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </AlertTitle>
          <AlertDescription>
            <div className="flex flex-col gap-1">
              <span>{log.message}</span>
              <span className="text-xs">
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
              </span>
              <Link href={`/automation/${log.workflow_id}`}>
                <Button variant="outline" size="sm" className="mt-1">
                  View Workflow
                </Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ))}
      
      {failedWorkflows.length > 3 && (
        <div className="text-sm text-muted-foreground text-center">
          + {failedWorkflows.length - 3} more workflow failures
        </div>
      )}
    </div>
  )
} 