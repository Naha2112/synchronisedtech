import { query } from "@/lib/db"
import { Workflow, WorkflowTrigger } from "@/app/autoflow/actions/workflows"

export async function triggerWorkflow(
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
            `Workflow \"${workflow.name}\" triggered by ${triggerType}`,
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