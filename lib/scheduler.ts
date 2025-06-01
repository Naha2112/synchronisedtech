"use server"

import { sendEmail } from "@/lib/email"
import { getEmailTemplate } from "@/app/autoflow/actions/email-templates"
import { getClient } from "@/app/autoflow/actions/clients"
import { Workflow, WorkflowTrigger, WorkflowAction } from "@/app/autoflow/actions/workflows"
import { query } from "@/lib/db"

// Type for recipients
type Recipient = {
  email: string;
  name: string;
};

// Add this function for test mode
async function logTestAction(workflowId: number, stepId: number | null, action: string, details: string) {
  // Replace any usage of query with Prisma or your new DB utility
  // Make all queries global
}

/**
 * Process scheduled emails that are due to be sent
 */
export async function processScheduledEmails() {
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  let processedCount = 0

  try {
    // Get scheduled emails that are due
    const scheduledEmails = await query(
      `SELECT se.*, et.subject, et.content, et.design, u.email as sender_email
       FROM scheduled_emails se
       JOIN email_templates et ON se.email_template_id = et.id
       JOIN users u ON se.created_by = u.id
       WHERE se.status = 'scheduled' 
       AND se.scheduled_date <= ?`,
      [now]
    ) as any[]

    // Process each email
    for (const email of scheduledEmails) {
      try {
        const recipientData = typeof email.recipient_data === 'string' 
          ? JSON.parse(email.recipient_data) 
          : email.recipient_data

        let recipients: Recipient[] = []

        // Get recipients based on type
        if (email.recipient_type === 'client') {
          // Single client
          const client = await getClient(recipientData.client_id)
          if (client.success && client.client) {
            recipients = [{ 
              email: client.client.email,
              name: client.client.name
            }]
          }
        } else if (email.recipient_type === 'client_group') {
          // Group of clients
          const clients = await query(
            "SELECT name, email FROM clients WHERE group_id = ?",
            [recipientData.group_id]
          ) as any[]
          
          recipients = clients.map(client => ({
            email: client.email,
            name: client.name
          }))
        } else if (email.recipient_type === 'all') {
          // All clients
          const clients = await query(
            "SELECT name, email FROM clients WHERE created_by = ?",
            [email.created_by]
          ) as any[]
          
          recipients = clients.map(client => ({
            email: client.email,
            name: client.name
          }))
        }

        // Send email to each recipient
        for (const recipient of recipients) {
          await sendEmail({
            to: recipient.email,
            subject: email.subject,
            html: email.content.replace(/{{name}}/g, recipient.name),
            from: email.sender_email,
          })
        }

        // Update email status
        await query(
          "UPDATE scheduled_emails SET status = 'sent', sent_date = NOW() WHERE id = ?",
          [email.id]
        )

        // Log success
        await query(
          "INSERT INTO workflow_logs (workflow_id, action, status, message) VALUES (?, ?, ?, ?)",
          [
            0, // 0 for scheduled emails not tied to a workflow
            'send_email',
            'success',
            `Sent scheduled email ID ${email.id} to ${recipients.length} recipients`
          ]
        )

        processedCount++
      } catch (error: any) {
        console.error(`Error processing scheduled email ${email.id}:`, error)

        // Update email status to failed
        await query(
          "UPDATE scheduled_emails SET status = 'failed' WHERE id = ?",
          [email.id]
        )

        // Log error
        await query(
          "INSERT INTO workflow_logs (workflow_id, action, status, message) VALUES (?, ?, ?, ?)",
          [
            0,
            'send_email',
            'failure',
            `Failed to send scheduled email ID ${email.id}: ${error.message}`
          ]
        )
      }
    }

    return { success: true, processedCount }
  } catch (error: any) {
    console.error("Error processing scheduled emails:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Process workflow steps that are pending
 */
export async function processWorkflowSteps() {
  let processedCount = 0

  try {
    // Get all pending workflow steps
    const steps = await query(
      `SELECT ws.*, aw.name as workflow_name, aw.created_by as user_id, wt.trigger_data
       FROM workflow_steps ws
       JOIN automation_workflows aw ON ws.workflow_id = aw.id
       LEFT JOIN workflow_triggers wt ON ws.workflow_id = wt.workflow_id AND wt.status = 'triggered'
       WHERE ws.status = 'pending'
       ORDER BY ws.workflow_id, ws.step_order`
    ) as any[]

    for (const step of steps) {
      try {
        // Mark step as in progress
        await query(
          "UPDATE workflow_steps SET status = 'in_progress', execution_time = NOW() WHERE id = ?",
          [step.id]
        )

        const actionData = typeof step.action_data === 'string' 
          ? JSON.parse(step.action_data) 
          : step.action_data

        const triggerData = typeof step.trigger_data === 'string' 
          ? JSON.parse(step.trigger_data) 
          : step.trigger_data || {}
          
        // Check if this is a test run
        const isTestMode = triggerData.test_mode === true

        // Execute the action based on type
        switch (step.action_type) {
          case 'send_email':
            if (isTestMode) {
              // Simulate sending email in test mode
              await logTestAction(
                step.workflow_id, 
                step.id, 
                'send_email', 
                `Would send email template ${actionData.template_id} to recipient ${JSON.stringify(actionData.recipient_type || 'unknown')}`
              )
            } else {
              await executeEmailAction(step, actionData, step.user_id)
            }
            break
          
          case 'wait':
            const waitDays = actionData.days || 1
            if (isTestMode) {
              // For test mode, don't actually wait
              await logTestAction(
                step.workflow_id, 
                step.id, 
                'wait', 
                `Would wait for ${waitDays} days`
              )
            } else {
              // For 'wait' steps, we need to schedule the next step
              const executionDate = new Date()
              executionDate.setDate(executionDate.getDate() + waitDays)
              
              await query(
                "UPDATE workflow_steps SET execution_time = ? WHERE id = ?",
                [executionDate.toISOString().slice(0, 19).replace('T', ' '), step.id]
              )
              // This step remains in_progress until the wait period is over
              continue
            }
            break
          
          case 'update_status':
            if (isTestMode) {
              // Simulate status update in test mode
              await logTestAction(
                step.workflow_id, 
                step.id, 
                'update_status', 
                `Would update ${actionData.entity_type || 'unknown'} ID ${actionData.entity_id || 'unknown'} status to "${actionData.status || 'unknown'}"`
              )
            } else if (actionData.entity_type === 'invoice' && actionData.entity_id) {
              await query(
                "UPDATE invoices SET status = ? WHERE id = ?",
                [actionData.status, actionData.entity_id]
              )
            }
            break
          
          case 'notify':
            if (isTestMode) {
              // Simulate notification in test mode
              await logTestAction(
                step.workflow_id, 
                step.id, 
                'notify', 
                `Would send notification: "${actionData.message || 'No message'}"`
              )
            } else {
              // Implementation for notifications would go here
              // Could be in-app notifications, SMS, etc.
            }
            break
        }

        // Mark step as completed
        await query(
          "UPDATE workflow_steps SET status = 'completed' WHERE id = ?",
          [step.id]
        )

        // Get the next step in the workflow
        const nextSteps = await query(
          `SELECT * FROM workflow_steps 
           WHERE workflow_id = ? AND step_order = ?`,
          [step.workflow_id, step.step_order + 1]
        ) as any[]

        if (nextSteps.length > 0) {
          // Mark the next step as pending
          await query(
            "UPDATE workflow_steps SET status = 'pending' WHERE id = ?",
            [nextSteps[0].id]
          )
        } else if (isTestMode) {
          // If this was the last step in a test workflow, update the trigger status
          await query(
            "UPDATE workflow_triggers SET status = 'completed' WHERE workflow_id = ? AND status = 'triggered' AND trigger_data LIKE '%test_mode%'",
            [step.workflow_id]
          )
          
          await logTestAction(
            step.workflow_id, 
            null, 
            'test_complete', 
            `Test workflow "${step.workflow_name}" completed successfully`
          )
        }

        processedCount++
      } catch (error: any) {
        console.error(`Error processing workflow step ${step.id}:`, error)
        
        // Mark step as failed
        await query(
          "UPDATE workflow_steps SET status = 'failed' WHERE id = ?",
          [step.id]
        )

        // Log error
        await query(
          "INSERT INTO workflow_logs (workflow_id, step_id, action, status, message) VALUES (?, ?, ?, ?, ?)",
          [
            step.workflow_id,
            step.id,
            step.action_type,
            'failure',
            `Failed to execute step: ${error.message}`
          ]
        )
      }
    }

    return { success: true, processedCount }
  } catch (error: any) {
    console.error("Error processing workflow steps:", error)
    return { success: false, error: error.message }
  }
}

/**
 * Execute email action for workflow step
 */
async function executeEmailAction(step: any, actionData: any, userId: number) {
  // Get the email template
  const templateResult = await getEmailTemplate(actionData.template_id)
  if (!templateResult.success || !templateResult.template) {
    throw new Error(`Email template not found: ${actionData.template_id}`)
  }
  
  const template = templateResult.template

  // Get recipient data
  let recipients: Recipient[] = []
  
  if (actionData.recipient_type === 'client' && actionData.client_id) {
    // Single client
    const client = await getClient(actionData.client_id)
    if (client.success && client.client) {
      recipients = [{ 
        email: client.client.email,
        name: client.client.name
      }]
    }
  } else if (actionData.recipient_type === 'entity') {
    // Entity-based recipient (e.g., invoice client)
    if (actionData.entity_type === 'invoice' && actionData.entity_id) {
      const invoices = await query(
        `SELECT c.name, c.email 
         FROM invoices i
         JOIN clients c ON i.client_id = c.id
         WHERE i.id = ?`,
        [actionData.entity_id]
      ) as any[]
      
      if (invoices.length > 0) {
        recipients = [{
          email: invoices[0].email,
          name: invoices[0].name
        }]
      }
    }
  }

  // Get sender email
  const users = await query(
    "SELECT email FROM users WHERE id = ?",
    [userId]
  ) as any[]
  
  if (users.length === 0) {
    throw new Error(`User not found: ${userId}`)
  }
  
  const senderEmail = users[0].email

  // Send email to each recipient
  for (const recipient of recipients) {
    await sendEmail({
      to: recipient.email,
      subject: template.subject,
      html: template.content.replace(/{{name}}/g, recipient.name),
      from: senderEmail,
    })
  }

  // Log success
  await query(
    "INSERT INTO workflow_logs (workflow_id, step_id, action, status, message) VALUES (?, ?, ?, ?, ?)",
    [
      step.workflow_id,
      step.id,
      'send_email',
      'success',
      `Sent email to ${recipients.length} recipients using template "${template.name}"`
    ]
  )
}

/**
 * Trigger a workflow based on event (scheduler-specific version)
 */
export async function triggerSchedulerWorkflow(
  triggerType: WorkflowTrigger,
  userId: number,
  data: any = {}
) {
  try {
    // Find active workflows with this trigger
    const workflows = await query(
      "SELECT * FROM automation_workflows WHERE trigger_type = ? AND is_active = true AND created_by = ?",
      [triggerType, userId]
    ) as Workflow[]

    if (workflows.length === 0) {
      return { success: true, message: "No active workflows found for this trigger" }
    }

    // For each matching workflow
    for (const workflow of workflows) {
      // Create a trigger record
      const result = await query(
        `INSERT INTO workflow_triggers 
         (workflow_id, trigger_type, entity_id, trigger_data) 
         VALUES (?, ?, ?, ?)`,
        [
          workflow.id,
          triggerType,
          data.entity_id || null,
          JSON.stringify(data)
        ]
      ) as any

      const triggerId = result.insertId

      // Get the first step of the workflow
      const steps = await query(
        "SELECT * FROM workflow_steps WHERE workflow_id = ? ORDER BY step_order LIMIT 1",
        [workflow.id]
      ) as any[]

      if (steps.length > 0) {
        // Update the step to pending status
        await query(
          "UPDATE workflow_steps SET status = 'pending' WHERE id = ?",
          [steps[0].id]
        )

        // Log the trigger
        await query(
          "INSERT INTO workflow_logs (workflow_id, action, status, message, data) VALUES (?, ?, ?, ?, ?)",
          [
            workflow.id,
            'trigger',
            'success',
            `Workflow "${workflow.name}" triggered by ${triggerType}`,
            JSON.stringify({ trigger_id: triggerId, data })
          ]
        )
      }
    }

    return { success: true, message: `Triggered ${workflows.length} workflows` }
  } catch (error: any) {
    console.error("Error triggering workflow:", error)
    return { success: false, message: error.message }
  }
} 