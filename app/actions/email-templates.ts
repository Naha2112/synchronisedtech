"use server"

import { query } from "@/lib/db"
import { requireAuth } from "@/lib/server-auth"
import { sendTestTemplateEmail } from "@/lib/email"

export type EmailTemplate = {
  id: number
  name: string
  subject: string
  body: string
  type: string
  status: "draft" | "active"
  created_at: string
  updated_at: string
}

export async function getEmailTemplates() {
  const user = await requireAuth()

  try {
    const templates = await query("SELECT * FROM email_templates WHERE created_by = ? ORDER BY updated_at DESC", [
      user.id,
    ])

    return { success: true, templates }
  } catch (error) {
    console.error("Get email templates error:", error)
    return { success: false, message: "Failed to fetch email templates" }
  }
}

export async function getEmailTemplate(id: number) {
  const user = await requireAuth()

  try {
    const templates = (await query("SELECT * FROM email_templates WHERE id = ? AND created_by = ?", [
      id,
      user.id,
    ])) as any[]

    if (templates.length === 0) {
      return { success: false, message: "Email template not found" }
    }

    return { success: true, template: templates[0] }
  } catch (error) {
    console.error("Get email template error:", error)
    return { success: false, message: "Failed to fetch email template" }
  }
}

export async function createEmailTemplate(data: {
  name: string
  subject: string
  body: string
  type: string
  status?: "draft" | "active"
}) {
  const user = await requireAuth()

  try {
    const result = (await query(
      `INSERT INTO email_templates 
      (name, subject, body, type, status, created_by) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [data.name, data.subject, data.body, data.type, data.status || "draft", user.id],
    )) as any

    return {
      success: true,
      message: "Email template created successfully",
      templateId: result.insertId,
    }
  } catch (error) {
    console.error("Create email template error:", error)
    return { success: false, message: "Failed to create email template" }
  }
}

export async function updateEmailTemplate(
  id: number,
  data: {
    name: string
    subject: string
    body: string
    type: string
    status?: "draft" | "active"
  },
) {
  const user = await requireAuth()

  try {
    await query(
      `UPDATE email_templates SET 
      name = ?, subject = ?, body = ?, type = ?, status = ?
      WHERE id = ? AND created_by = ?`,
      [data.name, data.subject, data.body, data.type, data.status || "draft", id, user.id],
    )

    return { success: true, message: "Email template updated successfully" }
  } catch (error) {
    console.error("Update email template error:", error)
    return { success: false, message: "Failed to update email template" }
  }
}

export async function deleteEmailTemplate(id: number) {
  const user = await requireAuth()

  try {
    await query("DELETE FROM email_templates WHERE id = ? AND created_by = ?", [id, user.id])

    return { success: true, message: "Email template deleted successfully" }
  } catch (error) {
    console.error("Delete email template error:", error)
    return { success: false, message: "Failed to delete email template" }
  }
}

export async function getRecentEmails() {
  const user = await requireAuth()
  
  // If there's no user, return an empty list
  if (!user) {
    return { success: false, emails: [], message: "Authentication required" }
  }

  try {
    const emails = await query(
      `
      SELECT 
        el.id,
        CONCAT('EM-', LPAD(el.id, 3, '0')) as id_formatted,
        et.name as subject,
        CASE 
          WHEN el.recipient LIKE '%@%' THEN el.recipient
          ELSE CONCAT(COUNT(el.recipient), ' clients')
        END as recipients,
        el.status,
        DATE_FORMAT(el.sent_at, '%b %d, %Y') as date
      FROM email_logs el
      LEFT JOIN email_templates et ON el.email_template_id = et.id
      WHERE et.created_by = ?
      GROUP BY el.id, et.name, el.status, el.sent_at
      ORDER BY el.sent_at DESC
      LIMIT 5
    `,
      [user.id],
    )

    return { success: true, emails }
  } catch (error) {
    console.error("Get recent emails error:", error)
    return { success: false, emails: [], message: "Failed to fetch recent emails" }
  }
}

export async function sendTestEmail(templateId: number, recipient: string) {
  const user = await requireAuth()

  try {
    // Get the template
    const templates = (await query("SELECT * FROM email_templates WHERE id = ? AND created_by = ?", [
      templateId,
      user.id,
    ])) as any[]

    if (templates.length === 0) {
      return { success: false, message: "Email template not found" }
    }

    const template = templates[0]
    
    // Replace placeholders with test data
    const subject = template.subject
      .replace(/{client_name}/g, "Test Client")
      .replace(/{invoice_number}/g, "INV-TEST")
      .replace(/{amount}/g, "$100.00")
      .replace(/{due_date}/g, "2023-12-31")

    const body = template.body
      .replace(/{client_name}/g, "Test Client")
      .replace(/{invoice_number}/g, "INV-TEST")
      .replace(/{amount}/g, "$100.00")
      .replace(/{due_date}/g, "2023-12-31")

    // Log the email
    await query(
      `INSERT INTO email_logs 
      (email_template_id, recipient, subject, body, status) 
      VALUES (?, ?, ?, ?, ?)`,
      [templateId, recipient, subject, body, "sent"],
    )

    // Actually send the email
    const emailResult = await sendTestTemplateEmail({
      to: recipient,
      subject,
      body,
    })

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
      return { success: false, message: "Failed to send email: " + (emailResult.error ? String(emailResult.error) : "Unknown error") }
    }

    return { success: true, message: "Test email sent successfully" }
  } catch (error) {
    console.error("Send test email error:", error)
    return { success: false, message: "Failed to send test email" }
  }
}
