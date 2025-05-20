import { NextResponse } from "next/server"
import { createConnection } from "@/lib/db"
import bcrypt from "bcrypt"

export async function GET() {
  try {
    const connection = await createConnection()

    // Create demo user if it doesn't exist
    const [users] = (await connection.execute("SELECT * FROM users WHERE email = ?", ["demo@autoflow.com"])) as any

    if (users.length === 0) {
      // Hash password
      const passwordHash = await bcrypt.hash("password", 10)

      // Create demo user
      await connection.execute("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)", [
        "Demo User",
        "demo@autoflow.com",
        passwordHash,
      ])

      // Get the user ID
      const [newUsers] = (await connection.execute("SELECT id FROM users WHERE email = ?", [
        "demo@autoflow.com",
      ])) as any

      const userId = newUsers[0].id

      // Create demo clients
      const clients = [
        {
          name: "Acme Inc",
          email: "billing@acme.com",
          phone: "555-123-4567",
          address: "123 Main St, New York, NY 10001",
        },
        {
          name: "Globex Corp",
          email: "accounts@globex.com",
          phone: "555-234-5678",
          address: "456 Market St, San Francisco, CA 94105",
        },
        {
          name: "Stark Industries",
          email: "finance@stark.com",
          phone: "555-345-6789",
          address: "789 Tech Blvd, Malibu, CA 90265",
        },
        {
          name: "Wayne Enterprises",
          email: "ap@wayne.com",
          phone: "555-456-7890",
          address: "1007 Mountain Dr, Gotham City, NJ 07101",
        },
      ]

      for (const client of clients) {
        await connection.execute(
          "INSERT INTO clients (name, email, phone, address, created_by) VALUES (?, ?, ?, ?, ?)",
          [client.name, client.email, client.phone, client.address, userId],
        )
      }

      // Get client IDs
      const [clientRows] = (await connection.execute("SELECT id, name FROM clients WHERE created_by = ?", [
        userId,
      ])) as any

      const clientMap = clientRows.reduce((map: any, client: any) => {
        map[client.name] = client.id
        return map
      }, {})

      // Create demo invoices
      const invoices = [
        {
          client: "Acme Inc",
          invoice_number: "INV-001",
          issue_date: "2025-05-01",
          due_date: "2025-05-15",
          status: "paid",
          items: [{ description: "Website Development", quantity: 1, rate: 1200, amount: 1200 }],
        },
        {
          client: "Globex Corp",
          invoice_number: "INV-002",
          issue_date: "2025-05-05",
          due_date: "2025-05-19",
          status: "sent",
          items: [{ description: "Monthly Maintenance", quantity: 1, rate: 850, amount: 850 }],
        },
        {
          client: "Stark Industries",
          invoice_number: "INV-003",
          issue_date: "2025-04-15",
          due_date: "2025-04-29",
          status: "overdue",
          items: [{ description: "Custom Software Development", quantity: 1, rate: 3200, amount: 3200 }],
        },
        {
          client: "Wayne Enterprises",
          invoice_number: "INV-004",
          issue_date: "2025-04-20",
          due_date: "2025-05-04",
          status: "paid",
          items: [{ description: "Security Audit", quantity: 1, rate: 720, amount: 720 }],
        },
      ]

      for (const invoice of invoices) {
        const clientId = clientMap[invoice.client]
        const total = invoice.items.reduce((sum, item) => sum + item.amount, 0)

        // Create invoice
        const [invoiceResult] = (await connection.execute(
          `INSERT INTO invoices 
          (invoice_number, client_id, issue_date, due_date, subtotal, tax_rate, tax_amount, total, status, created_by) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            invoice.invoice_number,
            clientId,
            invoice.issue_date,
            invoice.due_date,
            total,
            0,
            0,
            total,
            invoice.status,
            userId,
          ],
        )) as any

        const invoiceId = invoiceResult.insertId

        // Create invoice items
        for (const item of invoice.items) {
          await connection.execute(
            `INSERT INTO invoice_items 
            (invoice_id, description, quantity, rate, amount) 
            VALUES (?, ?, ?, ?, ?)`,
            [invoiceId, item.description, item.quantity, item.rate, item.amount],
          )
        }
      }

      // Create demo email templates
      const templates = [
        {
          name: "Invoice Payment Reminder",
          subject: "Reminder: Invoice #{invoice_number} Due Soon",
          body: "<p>Dear {client_name},</p><p>This is a friendly reminder that invoice #{invoice_number} for {invoice_amount} is due on {due_date}.</p><p>Thank you for your business!</p>",
          type: "Reminder",
          status: "active",
        },
        {
          name: "Welcome New Client",
          subject: "Welcome to Our Services",
          body: "<p>Dear {client_name},</p><p>Welcome aboard! We're excited to work with you.</p><p>If you have any questions, please don't hesitate to reach out.</p>",
          type: "Onboarding",
          status: "active",
        },
        {
          name: "Invoice Payment Confirmation",
          subject: "Payment Received for Invoice #{invoice_number}",
          body: "<p>Dear {client_name},</p><p>We've received your payment of {invoice_amount} for invoice #{invoice_number}.</p><p>Thank you for your prompt payment!</p>",
          type: "Confirmation",
          status: "active",
        },
      ]

      for (const template of templates) {
        await connection.execute(
          `INSERT INTO email_templates 
          (name, subject, body, type, status, created_by) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [template.name, template.subject, template.body, template.type, template.status, userId],
        )
      }

      // Create demo automation workflows
      const workflows = [
        {
          name: "Invoice Payment Reminder",
          description: "Sends reminder emails 3, 7, and 14 days before due date",
          trigger_type: "invoice_created",
          is_active: true,
          steps: [
            {
              step_order: 1,
              action_type: "wait",
              action_data: { days_before_due: 14 },
            },
            {
              step_order: 2,
              action_type: "send_email",
              action_data: { template_name: "Invoice Payment Reminder" },
            },
            {
              step_order: 3,
              action_type: "wait",
              action_data: { days: 7 },
            },
            {
              step_order: 4,
              action_type: "send_email",
              action_data: { template_name: "Invoice Payment Reminder" },
            },
          ],
        },
        {
          name: "New Client Onboarding",
          description: "Welcome sequence for new clients",
          trigger_type: "client_added",
          is_active: true,
          steps: [
            {
              step_order: 1,
              action_type: "send_email",
              action_data: { template_name: "Welcome New Client" },
            },
            {
              step_order: 2,
              action_type: "wait",
              action_data: { days: 7 },
            },
            {
              step_order: 3,
              action_type: "notify",
              action_data: { message: "Follow up with new client" },
            },
          ],
        },
      ]

      for (const workflow of workflows) {
        // Create workflow
        const [workflowResult] = (await connection.execute(
          `INSERT INTO automation_workflows 
          (name, description, trigger_type, is_active, created_by) 
          VALUES (?, ?, ?, ?, ?)`,
          [workflow.name, workflow.description, workflow.trigger_type, workflow.is_active, userId],
        )) as any

        const workflowId = workflowResult.insertId

        // Create workflow steps
        for (const step of workflow.steps) {
          await connection.execute(
            `INSERT INTO workflow_steps 
            (workflow_id, step_order, action_type, action_data) 
            VALUES (?, ?, ?, ?)`,
            [workflowId, step.step_order, step.action_type, JSON.stringify(step.action_data)],
          )
        }
      }
    }

    await connection.end()

    return NextResponse.json({
      success: true,
      message: "Setup completed successfully",
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ success: false, message: "Setup failed", error: String(error) }, { status: 500 })
  }
}
