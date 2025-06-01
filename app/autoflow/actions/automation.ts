"use server"

import { query } from "@/lib/db"

export type AutomationWorkflow = {
  id: number
  name: string
  description: string
  trigger_type: "invoice_created" | "invoice_due" | "invoice_overdue" | "client_added"
  is_active: boolean
  created_at: string
  updated_at: string
  steps?: WorkflowStep[]
}

export type WorkflowStep = {
  id: number
  workflow_id: number
  step_order: number
  action_type: "send_email" | "wait" | "update_status" | "notify"
  action_data: any
}

export async function getAutomationWorkflows() {
  try {
    const workflows = (await query("SELECT * FROM automation_workflows ORDER BY updated_at DESC")) as AutomationWorkflow[]

    // Get steps for each workflow
    for (const workflow of workflows) {
      const steps = (await query("SELECT * FROM workflow_steps WHERE workflow_id = ? ORDER BY step_order ASC", [
        workflow.id,
      ])) as WorkflowStep[]

      workflow.steps = steps.map((step) => ({
        ...step,
        action_data: JSON.parse(step.action_data as any),
      }))
    }

    return { success: true, workflows }
  } catch (error) {
    console.error("Get automation workflows error:", error)
    return { success: false, message: "Failed to fetch automation workflows" }
  }
}

export async function getAutomationWorkflow(id: number) {
  try {
    const workflows = (await query("SELECT * FROM automation_workflows WHERE id = ?", [
      id,
    ])) as AutomationWorkflow[]

    if (workflows.length === 0) {
      return { success: false, message: "Automation workflow not found" }
    }

    const workflow = workflows[0]

    // Get steps
    const steps = (await query("SELECT * FROM workflow_steps WHERE workflow_id = ? ORDER BY step_order ASC", [
      workflow.id,
    ])) as WorkflowStep[]

    workflow.steps = steps.map((step) => ({
      ...step,
      action_data: JSON.parse(step.action_data as any),
    }))

    return { success: true, workflow }
  } catch (error) {
    console.error("Get automation workflow error:", error)
    return { success: false, message: "Failed to fetch automation workflow" }
  }
}

export async function createAutomationWorkflow(data: {
  name: string
  description: string
  trigger_type: "invoice_created" | "invoice_due" | "invoice_overdue" | "client_added"
  is_active: boolean
  steps: {
    step_order: number
    action_type: "send_email" | "wait" | "update_status" | "notify"
    action_data: any
  }[]
}) {
  try {
    // Start a transaction
    const connection = await (await import("@/lib/db")).createConnection()
    await connection.beginTransaction()

    try {
      // Create workflow
      const [workflowResult] = (await connection.execute(
        `INSERT INTO automation_workflows 
        (name, description, trigger_type, is_active) 
        VALUES (?, ?, ?, ?)`,
        [data.name, data.description, data.trigger_type, data.is_active],
      )) as any

      const workflowId = workflowResult.insertId

      // Create workflow steps
      for (const step of data.steps) {
        await connection.execute(
          `INSERT INTO workflow_steps 
          (workflow_id, step_order, action_type, action_data) 
          VALUES (?, ?, ?, ?)`,
          [workflowId, step.step_order, step.action_type, JSON.stringify(step.action_data)],
        )
      }

      // Commit the transaction
      await connection.commit()

      return {
        success: true,
        message: "Automation workflow created successfully",
        workflowId,
      }
    } catch (error) {
      // Rollback the transaction on error
      await connection.rollback()
      throw error
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Create automation workflow error:", error)
    return { success: false, message: "Failed to create automation workflow" }
  }
}

export async function updateAutomationWorkflow(
  id: number,
  data: {
    name: string
    description: string
    trigger_type: "invoice_created" | "invoice_due" | "invoice_overdue" | "client_added"
    is_active: boolean
    steps: {
      id?: number
      step_order: number
      action_type: "send_email" | "wait" | "update_status" | "notify"
      action_data: any
    }[]
  },
) {
  try {
    // Start a transaction
    const connection = await (await import("@/lib/db")).createConnection()
    await connection.beginTransaction()

    try {
      // Update workflow
      await connection.execute(
        `UPDATE automation_workflows SET 
        name = ?, description = ?, trigger_type = ?, is_active = ?
        WHERE id = ?`,
        [data.name, data.description, data.trigger_type, data.is_active, id],
      )

      // Delete existing steps
      await connection.execute("DELETE FROM workflow_steps WHERE workflow_id = ?", [id])

      // Create new steps
      for (const step of data.steps) {
        await connection.execute(
          `INSERT INTO workflow_steps 
          (workflow_id, step_order, action_type, action_data) 
          VALUES (?, ?, ?, ?)`,
          [id, step.step_order, step.action_type, JSON.stringify(step.action_data)],
        )
      }

      // Commit the transaction
      await connection.commit()

      return { success: true, message: "Automation workflow updated successfully" }
    } catch (error) {
      // Rollback the transaction on error
      await connection.rollback()
      throw error
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Update automation workflow error:", error)
    return { success: false, message: "Failed to update automation workflow" }
  }
}

export async function toggleWorkflowStatus(id: number, isActive: boolean) {
  try {
    await query("UPDATE automation_workflows SET is_active = ? WHERE id = ?", [
      isActive,
      id,
    ])

    return { success: true, message: "Workflow status updated successfully" }
  } catch (error) {
    console.error("Toggle workflow status error:", error)
    return { success: false, message: "Failed to update workflow status" }
  }
}

export async function deleteAutomationWorkflow(id: number) {
  try {
    await query("DELETE FROM automation_workflows WHERE id = ?", [id])

    return { success: true, message: "Automation workflow deleted successfully" }
  } catch (error) {
    console.error("Delete automation workflow error:", error)
    return { success: false, message: "Failed to delete automation workflow" }
  }
}
