'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, PlayCircle, ToggleLeft, ToggleRight, Beaker } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { toggleWorkflowStatus, manualTriggerWorkflow } from '@/app/autoflow/actions/workflows'
import { toast } from '@/components/ui/use-toast'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface WorkflowActionsProps {
  id: number
  isActive: boolean
}

export default function WorkflowActions({ id, isActive }: WorkflowActionsProps) {
  const router = useRouter()
  const [isToggling, setIsToggling] = useState(false)
  const [isTriggering, setIsTriggering] = useState(false)
  const [showTriggerDialog, setShowTriggerDialog] = useState(false)
  const [showTestDialog, setShowTestDialog] = useState(false)
  const [testMode, setTestMode] = useState(true)

  // Function to toggle workflow status
  const toggleStatus = async () => {
    setIsToggling(true)
    try {
      const result = await toggleWorkflowStatus(id, !isActive)
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error toggling workflow status:', error)
      toast({
        title: "Error",
        description: "Failed to toggle workflow status",
        variant: "destructive",
      })
    } finally {
      setIsToggling(false)
    }
  }

  // Function to manually trigger workflow
  const triggerWorkflow = async () => {
    setIsTriggering(true)
    setShowTriggerDialog(false)
    
    try {
      const result = await manualTriggerWorkflow(id, {})
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error triggering workflow:', error)
      toast({
        title: "Error",
        description: "Failed to trigger workflow",
        variant: "destructive",
      })
    } finally {
      setIsTriggering(false)
    }
  }

  // Function to manually trigger workflow in test mode
  const triggerTestWorkflow = async () => {
    setIsTriggering(true)
    setShowTestDialog(false)
    
    try {
      const result = await manualTriggerWorkflow(id, { test_mode: true })
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Test mode: Workflow steps were simulated but no actual actions were performed.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error triggering test workflow:', error)
      toast({
        title: "Error",
        description: "Failed to test workflow",
        variant: "destructive",
      })
    } finally {
      setIsTriggering(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={toggleStatus}
          disabled={isToggling}
        >
          {isActive ? (
            <ToggleRight className="h-4 w-4 mr-2" />
          ) : (
            <ToggleLeft className="h-4 w-4 mr-2" />
          )}
          {isToggling 
            ? 'Updating...' 
            : isActive 
              ? 'Deactivate' 
              : 'Activate'}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowTriggerDialog(true)}
          disabled={isTriggering || !isActive}
        >
          <PlayCircle className="h-4 w-4 mr-2" />
          {isTriggering ? 'Running...' : 'Run Now'}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowTestDialog(true)}
          disabled={isTriggering}
        >
          <Beaker className="h-4 w-4 mr-2" />
          Test
        </Button>

        <Link href={`/autoflow/automation/${id}/edit`}>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      <AlertDialog open={showTriggerDialog} onOpenChange={setShowTriggerDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trigger Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              This will manually trigger the workflow. It will run immediately regardless of the normal trigger conditions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={triggerWorkflow}>
              Run Workflow
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Test mode will simulate all steps without actually performing actions like sending emails or updating records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Switch
              id="test-mode"
              checked={testMode}
              onCheckedChange={setTestMode}
            />
            <Label htmlFor="test-mode">Simulate actions (no real emails, updates, etc.)</Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={triggerTestWorkflow}>
              Run Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 