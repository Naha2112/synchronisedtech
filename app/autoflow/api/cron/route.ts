import { NextResponse } from "next/server"
import { processScheduledEmails, processWorkflowSteps } from "@/lib/scheduler"

// API secret to protect the endpoint
const API_SECRET = process.env.CRON_API_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    // Get the API key from request headers
    const authHeader = request.headers.get("authorization")
    
    // Basic security check
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== API_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Process all scheduled actions
    const emailResults = await processScheduledEmails()
    const workflowResults = await processWorkflowSteps()
    
    return NextResponse.json({
      success: true,
      processed: {
        emails: emailResults.processed || 0,
        workflows: workflowResults.processed || 0,
      },
    })
  } catch (error) {
    console.error("Cron process error:", error)
    return NextResponse.json(
      { success: false, message: "Failed to process scheduled tasks", error: String(error) },
      { status: 500 }
    )
  }
} 