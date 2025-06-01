"use server"

import { triggerWorkflow } from "@/lib/triggerWorkflow"
import { query } from "@/lib/db"

// Types
export type WorkflowTrigger = 'invoice_created' | 'invoice_due' | 'invoice_overdue' | 'client_added'
export type WorkflowAction = 'send_email' | 'wait' | 'update_status' | 'notify'

export type WorkflowStep = {
  id?: number
  step_order: number
  action_type: WorkflowAction
  action_data: any
}

export type Workflow = {
  id: number
  name: string
  description: string
  trigger_type: WorkflowTrigger
  is_active: boolean
  created_at: string
  steps?: WorkflowStep[]
}

/**
 * Get all workflows for the current user
 */
export async function getWorkflows(userId: number = 1) {
  try {
    // Get workflows for user, or all workflows if user doesn't exist
    const workflows = await query(
      "SELECT * FROM automation_workflows WHERE created_by = ? OR ? = 1 ORDER BY created_at DESC",
      [userId, userId]
    ) as Workflow[]

    return { success: true, workflows }
  } catch (error) {
    console.error("Get workflows error:", error)
    return { success: false, message: "Failed to fetch workflows" }
  }
}

/**
 * Get a specific workflow with its steps
 */
export async function getWorkflow(id: number, userId: number) {
  try {
    // Get workflow
    const workflows = await query(
      "SELECT * FROM automation_workflows WHERE id = ? AND created_by = ?",
      [id, userId]
    ) as Workflow[]

    if (workflows.length === 0) {
      return { success: false, message: "Workflow not found" }
    }

    const workflow = workflows[0]

    // Get steps
    const steps = await query(
      "SELECT * FROM workflow_steps WHERE workflow_id = ? ORDER BY step_order",
      [id]
    ) as WorkflowStep[]

    workflow.steps = steps

    return { success: true, workflow }
  } catch (error) {
    console.error("Get workflow error:", error)
    return { success: false, message: "Failed to fetch workflow" }
  }
}

/**
 * Create a new workflow
 */
export async function createWorkflow(data: {
  name: string
  description: string
  trigger_type: WorkflowTrigger
  is_active?: boolean
  steps: WorkflowStep[]
}, userId: number) {
  try {
    // Create workflow
    const result = await query(
      `INSERT INTO automation_workflows 
      (name, description, trigger_type, is_active, created_by) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        data.name,
        data.description,
        data.trigger_type,
        data.is_active === undefined ? true : data.is_active,
        userId,
      ]
    ) as any

    const workflowId = result.insertId

    // Create steps
    for (const step of data.steps) {
      await query(
        `INSERT INTO workflow_steps 
        (workflow_id, step_order, action_type, action_data, status) 
        VALUES (?, ?, ?, ?, 'pending')`,
        [
          workflowId,
          step.step_order,
          step.action_type,
          JSON.stringify(step.action_data),
        ]
      )
    }

    return {
      success: true,
      message: "Workflow created successfully",
      workflowId,
    }
  } catch (error) {
    console.error("Create workflow error:", error)
    return { success: false, message: "Failed to create workflow" }
  }
}

/**
 * Update an existing workflow
 */
export async function updateWorkflow(
  id: number,
  data: {
    name: string
    description: string
    trigger_type: WorkflowTrigger
    is_active: boolean
    steps: WorkflowStep[]
  },
  userId: number
) {
  try {
    // Update workflow
    await query(
      `UPDATE automation_workflows SET 
      name = ?, description = ?, trigger_type = ?, is_active = ?
      WHERE id = ? AND created_by = ?`,
      [
        data.name,
        data.description,
        data.trigger_type,
        data.is_active,
        id,
        userId,
      ]
    )

    // Delete existing steps
    await query("DELETE FROM workflow_steps WHERE workflow_id = ?", [id])

    // Create new steps
    for (const step of data.steps) {
      await query(
        `INSERT INTO workflow_steps 
        (workflow_id, step_order, action_type, action_data, status) 
        VALUES (?, ?, ?, ?, 'pending')`,
        [
          id,
          step.step_order,
          step.action_type,
          JSON.stringify(step.action_data),
        ]
      )
    }

    return { success: true, message: "Workflow updated successfully" }
  } catch (error) {
    console.error("Update workflow error:", error)
    return { success: false, message: "Failed to update workflow" }
  }
}

/**
 * Toggle workflow active status
 */
export async function toggleWorkflowStatus(id: number, isActive: boolean, userId: number) {
  try {
    await query(
      "UPDATE automation_workflows SET is_active = ? WHERE id = ? AND created_by = ?",
      [isActive, id, userId]
    )

    return { success: true, message: `Workflow ${isActive ? 'activated' : 'deactivated'} successfully` }
  } catch (error) {
    console.error("Toggle workflow status error:", error)
    return { success: false, message: "Failed to update workflow status" }
  }
}

/**
 * Delete a workflow
 */
export async function deleteWorkflow(id: number, userId: number) {
  try {
    // First delete steps (this should cascade, but just to be sure)
    await query("DELETE FROM workflow_steps WHERE workflow_id = ?", [id])
    
    // Then delete the workflow
    await query(
      "DELETE FROM automation_workflows WHERE id = ? AND created_by = ?",
      [id, userId]
    )

    return { success: true, message: "Workflow deleted successfully" }
  } catch (error) {
    console.error("Delete workflow error:", error)
    return { success: false, message: "Failed to delete workflow" }
  }
}

/**
 * Create a scheduled email
 */
export async function scheduleEmail(data: {
  email_template_id: number
  recipient_type: 'client' | 'client_group' | 'all'
  recipient_data: any
  scheduled_date: string
}, userId: number) {
  try {
    await query(
      `INSERT INTO scheduled_emails 
      (email_template_id, recipient_type, recipient_data, scheduled_date, created_by) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        data.email_template_id,
        data.recipient_type,
        JSON.stringify(data.recipient_data),
        data.scheduled_date,
        userId,
      ]
    )

    return { success: true, message: "Email scheduled successfully" }
  } catch (error) {
    console.error("Schedule email error:", error)
    return { success: false, message: "Failed to schedule email" }
  }
}

/**
 * Manually trigger a workflow
 */
export async function manualTriggerWorkflow(
  workflowId: number,
  data: any,
  userId: number
) {
  try {
    // Get the workflow
    const workflows = await query(
      "SELECT * FROM automation_workflows WHERE id = ? AND created_by = ?",
      [workflowId, userId]
    ) as Workflow[]

    if (workflows.length === 0) {
      return { success: false, message: "Workflow not found" }
    }

    const workflow = workflows[0]
    
    // Trigger the workflow
    await triggerWorkflow(workflow.trigger_type, userId, data)

    return { success: true, message: "Workflow triggered successfully" }
  } catch (error) {
    console.error("Manual trigger workflow error:", error)
    return { success: false, message: "Failed to trigger workflow" }
  }
} 