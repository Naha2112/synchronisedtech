'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArrowLeft, Plus, Trash2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { createWorkflow, WorkflowTrigger, WorkflowAction } from '@/app/autoflow/actions/workflows'
import { toast } from '@/components/ui/use-toast'
import { getEmailTemplates } from '@/app/autoflow/actions/email-templates'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

// Define workflow schema
const workflowFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Workflow name must be at least 3 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  trigger_type: z.enum(['invoice_created', 'invoice_due', 'invoice_overdue', 'client_added'] as const),
  is_active: z.boolean().default(true),
  steps: z.array(
    z.object({
      step_order: z.number(),
      action_type: z.enum(['send_email', 'wait', 'update_status', 'notify'] as const),
      action_data: z.any(),
    })
  ).min(1, {
    message: 'Workflow must have at least one step.',
  }),
})

type WorkflowFormValues = z.infer<typeof workflowFormSchema>

// Define a type for email templates
type EmailTemplate = {
  id: number;
  name: string;
}

// Define common workflow templates
const workflowTemplates = [
  {
    name: "Invoice Payment Reminder",
    description: "Automatically sends reminders to clients before an invoice is due and if it becomes overdue.",
    trigger_type: "invoice_created" as WorkflowTrigger,
    steps: [
      {
        step_order: 1,
        action_type: "wait" as WorkflowAction,
        action_data: { days: 7 }
      },
      {
        step_order: 2,
        action_type: "send_email" as WorkflowAction,
        action_data: { template_id: null, recipient_type: "entity", entity_type: "invoice" }
      },
      {
        step_order: 3,
        action_type: "wait" as WorkflowAction,
        action_data: { days: 3 }
      },
      {
        step_order: 4,
        action_type: "send_email" as WorkflowAction,
        action_data: { template_id: null, recipient_type: "entity", entity_type: "invoice" }
      }
    ]
  },
  {
    name: "Client Onboarding",
    description: "Welcome new clients with a series of introductory emails.",
    trigger_type: "client_added" as WorkflowTrigger,
    steps: [
      {
        step_order: 1,
        action_type: "send_email" as WorkflowAction,
        action_data: { template_id: null, recipient_type: "client" }
      },
      {
        step_order: 2,
        action_type: "wait" as WorkflowAction,
        action_data: { days: 3 }
      },
      {
        step_order: 3,
        action_type: "send_email" as WorkflowAction,
        action_data: { template_id: null, recipient_type: "client" }
      }
    ]
  },
  {
    name: "Overdue Invoice Collection",
    description: "Follow up with clients who have overdue invoices.",
    trigger_type: "invoice_overdue" as WorkflowTrigger,
    steps: [
      {
        step_order: 1,
        action_type: "send_email" as WorkflowAction,
        action_data: { template_id: null, recipient_type: "entity", entity_type: "invoice" }
      },
      {
        step_order: 2,
        action_type: "wait" as WorkflowAction,
        action_data: { days: 7 }
      },
      {
        step_order: 3,
        action_type: "send_email" as WorkflowAction,
        action_data: { template_id: null, recipient_type: "entity", entity_type: "invoice" }
      },
      {
        step_order: 4,
        action_type: "notify" as WorkflowAction,
        action_data: { message: "Client still hasn't paid invoice. Consider direct contact." }
      }
    ]
  }
]

export default function CreateWorkflowPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [showTemplates, setShowTemplates] = useState(true)
  
  // Fetch email templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      const result = await getEmailTemplates()
      if (result.success && result.templates) {
        // Safely type and map the templates
        const templates = result.templates as any[];
        setEmailTemplates(templates.map(template => ({
          id: template.id,
          name: template.name
        })))
      }
    }
    
    fetchTemplates()
  }, [])

  // Set default values
  const defaultValues: Partial<WorkflowFormValues> = {
    name: '',
    description: '',
    trigger_type: 'invoice_created',
    is_active: true,
    steps: [
      {
        step_order: 1,
        action_type: 'send_email',
        action_data: { template_id: null },
      },
    ],
  }

  const form = useForm<WorkflowFormValues>({
    resolver: zodResolver(workflowFormSchema),
    defaultValues,
  })

  // Watch the steps to update UI
  const steps = form.watch('steps')

  // Add a new step
  const addStep = () => {
    const currentSteps = form.getValues('steps')
    const newStepOrder = currentSteps.length + 1
    
    form.setValue('steps', [
      ...currentSteps,
      {
        step_order: newStepOrder,
        action_type: 'send_email',
        action_data: { template_id: null },
      },
    ])
  }

  // Remove a step
  const removeStep = (index: number) => {
    const currentSteps = form.getValues('steps')
    if (currentSteps.length <= 1) {
      toast({
        title: "Cannot remove step",
        description: "A workflow must have at least one step.",
        variant: "destructive",
      })
      return
    }
    
    const newSteps = currentSteps.filter((_, i) => i !== index)
    // Reorder steps
    newSteps.forEach((step, i) => {
      step.step_order = i + 1
    })
    
    form.setValue('steps', newSteps)
  }

  // Handle action type change
  const handleActionTypeChange = (value: WorkflowAction, index: number) => {
    const currentSteps = form.getValues('steps')
    let actionData = {}
    
    // Set default action data based on type
    switch (value) {
      case 'send_email':
        actionData = { template_id: null }
        break
      case 'wait':
        actionData = { days: 1 }
        break
      case 'update_status':
        actionData = { status: 'paid' }
        break
      case 'notify':
        actionData = { message: '' }
        break
    }
    
    currentSteps[index].action_type = value
    currentSteps[index].action_data = actionData
    
    form.setValue('steps', [...currentSteps])
  }

  // Handle action data change
  const handleActionDataChange = (key: string, value: any, index: number) => {
    const currentSteps = form.getValues('steps')
    
    if (key === 'template_id' && value === 'no-templates') {
      // Handle the no-templates case by setting null
      currentSteps[index].action_data = {
        ...currentSteps[index].action_data,
        [key]: null,
      }
    } else {
      currentSteps[index].action_data = {
        ...currentSteps[index].action_data,
        [key]: value,
      }
    }
    
    form.setValue('steps', [...currentSteps])
  }

  // Form submission handler
  async function onSubmit(data: WorkflowFormValues) {
    setIsSubmitting(true)
    try {
      // TODO: Get actual userId from session in production
      const userId = 1; // Placeholder for demo
      const result = await createWorkflow(data, userId)
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        router.push('/autoflow/automation')
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating workflow:', error)
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render action fields based on action type
  const renderActionFields = (step: any, index: number) => {
    switch (step.action_type) {
      case 'send_email':
        return (
          <div className="mt-2">
            <FormLabel>Email Template</FormLabel>
            <Select
              value={emailTemplates.length > 0 ? (step.action_data.template_id?.toString() || emailTemplates[0].id.toString()) : "no-templates"}
              onValueChange={(value) => handleActionDataChange('template_id', value !== "no-templates" ? parseInt(value) || null : null, index)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an email template" />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.length > 0 ? (
                  emailTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id.toString()}>
                      {template.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-templates" disabled>No templates available</SelectItem>
                )}
              </SelectContent>
            </Select>
            {!emailTemplates.length && (
              <p className="text-sm text-muted-foreground mt-1">
                <Link href="/autoflow/email-templates/new" className="text-primary hover:underline">
                  Create an email template
                </Link> to use in this workflow
              </p>
            )}
          </div>
        )
      
      case 'wait':
        return (
          <div className="mt-2">
            <FormLabel>Wait Duration (Days)</FormLabel>
            <Input 
              type="number" 
              min="1"
              value={step.action_data.days || 1}
              onChange={(e) => handleActionDataChange('days', parseInt(e.target.value), index)}
            />
          </div>
        )
      
      case 'update_status':
        return (
          <div className="mt-2">
            <FormLabel>New Status</FormLabel>
            <Select
              value={step.action_data.status || 'paid'}
              onValueChange={(value) => handleActionDataChange('status', value, index)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )
      
      case 'notify':
        return (
          <div className="mt-2">
            <FormLabel>Notification Message</FormLabel>
            <Textarea
              value={step.action_data.message || ''}
              onChange={(e) => handleActionDataChange('message', e.target.value, index)}
              placeholder="Enter notification message"
            />
          </div>
        )
      
      default:
        return null
    }
  }

  // Function to apply a template
  const applyTemplate = (template: typeof workflowTemplates[0]) => {
    form.setValue('name', template.name)
    form.setValue('description', template.description)
    form.setValue('trigger_type', template.trigger_type)
    form.setValue('steps', template.steps.map(step => ({
      ...step,
      action_data: { ...step.action_data } // Create a fresh copy to avoid reference issues
    })))
    setShowTemplates(false)
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link href="/autoflow/automation" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Workflow</h1>
            <p className="text-muted-foreground">
              Set up a new automated workflow
            </p>
          </div>
        </div>
      </div>

      {showTemplates && emailTemplates.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Start with a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {workflowTemplates.map((template, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => applyTemplate(template)}>
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Trigger: {template.trigger_type.replace('_', ' ')}
                    <br />
                    Steps: {template.steps.length}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed" onClick={() => setShowTemplates(false)}>
              <CardHeader className="flex items-center justify-center h-full">
                <CardTitle className="text-muted-foreground">Start from Scratch</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </>
      ) : emailTemplates.length === 0 ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>You need email templates first</AlertTitle>
          <AlertDescription>
            Before creating workflows, you need to set up email templates that will be used in your automation steps.
            <div className="mt-2">
              <Link href="/autoflow/email-templates/new">
                <Button size="sm">Create Email Template</Button>
              </Link>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workflow Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Invoice Payment Reminder" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what this workflow does" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="trigger_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trigger</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a trigger" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="invoice_created">When an invoice is created</SelectItem>
                            <SelectItem value="invoice_due">When an invoice is due</SelectItem>
                            <SelectItem value="invoice_overdue">When an invoice is overdue</SelectItem>
                            <SelectItem value="client_added">When a client is added</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This event will trigger the workflow
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <FormDescription>
                            Enable or disable this workflow
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Workflow Steps</h2>
                <Button type="button" variant="outline" onClick={addStep}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              {steps.map((step, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Step {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    <div>
                      <FormLabel>Action Type</FormLabel>
                      <Select
                        value={step.action_type}
                        onValueChange={(value) => handleActionTypeChange(value as WorkflowAction, index)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="send_email">Send Email</SelectItem>
                          <SelectItem value="wait">Wait</SelectItem>
                          <SelectItem value="update_status">Update Status</SelectItem>
                          <SelectItem value="notify">Send Notification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {renderActionFields(step, index)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/autoflow/automation">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Workflow'}
            </Button>
          </div>
        </form>
      </Form>
      
      {!showTemplates && (
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => setShowTemplates(true)}>
            View workflow templates
          </Button>
        </div>
      )}
    </div>
  )
} 