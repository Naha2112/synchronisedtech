"use server"

import { query } from "@/lib/db"
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
  try {
    const templates = await query("SELECT * FROM email_templates ORDER BY updated_at DESC")

    return { success: true, templates }
  } catch (error) {
    console.error("Get email templates error:", error)
    return { success: false, message: "Failed to fetch email templates" }
  }
}

export async function getEmailTemplate(id: number) {
  try {
    const templates = (await query("SELECT * FROM email_templates WHERE id = ?", [
      id,
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
  try {
    const result = (await query(
      `INSERT INTO email_templates 
      (name, subject, body, type, status) 
      VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.subject, data.body, data.type, data.status || "draft"],
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
  try {
    await query(
      `UPDATE email_templates SET 
      name = ?, subject = ?, body = ?, type = ?, status = ?
      WHERE id = ?`,
      [data.name, data.subject, data.body, data.type, data.status || "draft", id],
    )

    return { success: true, message: "Email template updated successfully" }
  } catch (error) {
    console.error("Update email template error:", error)
    return { success: false, message: "Failed to update email template" }
  }
}

export async function deleteEmailTemplate(id: number) {
  try {
    await query("DELETE FROM email_templates WHERE id = ?", [id])

    return { success: true, message: "Email template deleted successfully" }
  } catch (error) {
    console.error("Delete email template error:", error)
    return { success: false, message: "Failed to delete email template" }
  }
}

export async function getRecentEmails() {
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
      GROUP BY el.id, et.name, el.status, el.sent_at
      ORDER BY el.sent_at DESC
      LIMIT 5
    `)

    return { success: true, emails }
  } catch (error) {
    console.error("Get recent emails error:", error)
    return { success: false, emails: [], message: "Failed to fetch recent emails" }
  }
}

export async function sendTestEmail(templateId: number, recipient: string) {
  try {
    // Validate input
    if (!recipient || !recipient.trim()) {
      return { success: false, message: "Recipient email is required" }
    }

    // Clean recipient email
    const cleanedRecipient = recipient.trim();

    // Get the template
    const templates = (await query("SELECT * FROM email_templates WHERE id = ?", [
      templateId,
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

    // Log before sending
    console.log(`Attempting to send test email to ${cleanedRecipient} for template ${templateId}`);

    // Log the email
    await query(
      `INSERT INTO email_logs 
      (email_template_id, recipient, subject, body, status) 
      VALUES (?, ?, ?, ?, ?)`,
      [templateId, cleanedRecipient, subject, body, "sent"],
    )

    // Actually send the email
    const emailResult = await sendTestTemplateEmail({
      to: cleanedRecipient,
      subject,
      body,
    })

    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error);
      
      // Better error handling for complex error objects
      let errorMessage = "Failed to send email";
      if (emailResult.error) {
        if (typeof emailResult.error === 'string') {
          errorMessage += ": " + emailResult.error;
        } else if (typeof emailResult.error === 'object') {
          // Handle Resend API error object which might have message/name/code properties
          const errorObj = emailResult.error as any;
          if (errorObj.message) {
            errorMessage += ": " + errorObj.message;
          } else {
            // Last resort - stringify the entire object
            try {
              errorMessage += ": " + JSON.stringify(errorObj);
            } catch (e) {
              // If JSON stringify fails, use a generic message
              errorMessage += ": Unknown error details";
            }
          }
        }
      }
      
      // Update the email log status to failed
      await query(
        `UPDATE email_logs SET status = 'failed' WHERE email_template_id = ? AND recipient = ? ORDER BY id DESC LIMIT 1`,
        [templateId, cleanedRecipient]
      );
      
      return { success: false, message: errorMessage, error: emailResult.error };
    }

    return { success: true, message: "Test email sent successfully" }
  } catch (error) {
    console.error("Send test email error:", error)
    return { success: false, message: "Failed to send test email", error: error instanceof Error ? error.message : String(error) }
  }
}

export async function scheduleEmail({
  templateId,
  recipient,
  scheduledDate,
  timezoneOffset = 0,
}: {
  templateId: number;
  recipient: string;
  scheduledDate: string;
  timezoneOffset?: number;
}) {
  try {
    // Get the template
    const templates = (await query("SELECT * FROM email_templates WHERE id = ?", [
      templateId,
    ])) as any[];

    if (templates.length === 0) {
      return { success: false, message: "Email template not found" };
    }

    const template = templates[0];
    
    // Replace placeholders with test data
    const subject = template.subject
      .replace(/{client_name}/g, "Test Client")
      .replace(/{invoice_number}/g, "INV-TEST")
      .replace(/{amount}/g, "$100.00")
      .replace(/{due_date}/g, "2023-12-31");

    const body = template.body
      .replace(/{client_name}/g, "Test Client")
      .replace(/{invoice_number}/g, "INV-TEST")
      .replace(/{amount}/g, "$100.00")
      .replace(/{due_date}/g, "2023-12-31");

    // Parse the input date (which is in ISO format)
    const scheduledDateTime = new Date(scheduledDate);
    
    // Important: For UK time (British Summer Time), we need to store the exact time 
    // as specified by the user, but in a format MySQL understands
    
    // Format the date and time components manually to ensure proper formatting
    const year = scheduledDateTime.getFullYear();
    const month = String(scheduledDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(scheduledDateTime.getDate()).padStart(2, '0');
    const hours = String(scheduledDateTime.getHours()).padStart(2, '0');
    const minutes = String(scheduledDateTime.getMinutes()).padStart(2, '0');
    const seconds = String(scheduledDateTime.getSeconds()).padStart(2, '0');
    
    // Create MySQL datetime format: YYYY-MM-DD HH:MM:SS
    // This preserves the exact time the user selected without any timezone conversion
    const mysqlDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    console.log(`Scheduling email: Original time selected: ${scheduledDate}`);
    console.log(`Scheduling for MySQL time: ${mysqlDateString}`);

    // Schedule the email
    await query(
      `INSERT INTO scheduled_emails 
      (email_template_id, recipient, subject, body, scheduled_date) 
      VALUES (?, ?, ?, ?, ?)`,
      [templateId, recipient, subject, body, mysqlDateString],
    );

    return { success: true, message: "Email scheduled successfully" };
  } catch (error) {
    console.error("Schedule email error:", error);
    return { success: false, message: "Failed to schedule email" };
  }
}

export async function getScheduledEmails() {
  try {
    const emails = await query(`
      SELECT 
        se.*,
        et.name as template_name
      FROM scheduled_emails se
      JOIN email_templates et ON se.email_template_id = et.id
      ORDER BY se.scheduled_date DESC
    `) as any[];
    
    return { success: true, emails };
  } catch (error) {
    console.error("Get scheduled emails error:", error);
    return { success: false, emails: [], message: "Failed to fetch scheduled emails" };
  }
}

export async function cancelScheduledEmail(id: number) {
  try {
    // Check if the email exists
    const emails = await query(
      "SELECT * FROM scheduled_emails WHERE id = ?",
      [id]
    ) as any[];
    
    if (emails.length === 0) {
      return { success: false, message: "Scheduled email not found" };
    }
    
    // Check if it's already sent
    const email = emails[0];
    if (email.status !== 'scheduled') {
      return { success: false, message: `Cannot cancel email with status '${email.status}'` };
    }
    
    // Delete the scheduled email
    await query(
      "DELETE FROM scheduled_emails WHERE id = ?",
      [id]
    );
    
    return { success: true, message: "Scheduled email canceled successfully" };
  } catch (error) {
    console.error("Cancel scheduled email error:", error);
    return { success: false, message: "Failed to cancel scheduled email" };
  }
}
