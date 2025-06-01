"use server"

// Types
export type WorkflowLogStatus = 'success' | 'failure' | 'info'

export type WorkflowLog = {
  id: number
  workflow_id: number
  step_id: number | null
  action: string
  status: WorkflowLogStatus
  message: string
  data: any
  created_at: string
}

/**
 * Get logs for a specific workflow
 */
export async function getWorkflowLogs(workflowId: number) {
  try {
    // Verify user has access to this workflow
    const workflows = await query(
      "SELECT id FROM automation_workflows WHERE id = ? AND created_by = ?",
      [workflowId, user.id]
    ) as any[]

    if (workflows.length === 0) {
      return { success: false, message: "Workflow not found or access denied" }
    }

    // Get logs
    const logs = await query(
      `SELECT * FROM workflow_logs 
       WHERE workflow_id = ? 
       ORDER BY created_at DESC 
       LIMIT 100`,
      [workflowId]
    ) as WorkflowLog[]

    return { success: true, logs }
  } catch (error) {
    console.error("Get workflow logs error:", error)
    return { success: false, message: "Failed to fetch workflow logs" }
  }
}

/**
 * Get all recent logs for current user
 */
export async function getRecentLogs(limit = 20) {
  try {
    // Convert the limit to a string in the query instead of using a placeholder
    const logs = await query(
      `SELECT wl.* 
       FROM workflow_logs wl
       JOIN automation_workflows aw ON wl.workflow_id = aw.id
       WHERE aw.created_by = ?
       ORDER BY wl.created_at DESC
       LIMIT ${parseInt(limit.toString())}`,
      [user.id]
    ) as WorkflowLog[]

    return { success: true, logs }
  } catch (error) {
    console.error("Get recent logs error:", error)
    return { success: false, message: "Failed to fetch logs" }
  }
} 