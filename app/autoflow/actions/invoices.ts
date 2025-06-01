"use server"

import prisma from "@/lib/prisma"

export type InvoiceItem = {
  id?: number
  description: string
  quantity: number
  rate: number
  amount: number
}

export type Invoice = {
  id: number
  invoice_number: string
  client_id: number
  client_name?: string
  client_email?: string
  issue_date: string
  due_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  status: "draft" | "sent" | "viewed" | "paid" | "overdue"
  notes?: string
  created_at: string
  items?: InvoiceItem[]
}

export async function getInvoices() {
  try {
    const invoices = await prisma.invoices.findMany({
      include: {
        clients: true,
        invoice_items: true,
      },
      orderBy: { created_at: "desc" },
    })
    
    // Transform invoices to include client data in expected format
    const transformedInvoices = invoices.map((invoice: any) => ({
      ...invoice,
      client_name: invoice.clients?.name || 'Unknown Client',
      client_email: invoice.clients?.email || '',
      items: invoice.invoice_items || [],
    }))
    
    return { success: true, invoices: transformedInvoices }
  } catch (error) {
    console.error("Get invoices error:", error)
    return { success: false, message: "Failed to fetch invoices" }
  }
}

export async function getInvoice(id: number) {
  try {
    const invoice = await prisma.invoices.findUnique({
      where: { id },
      include: {
        clients: true,
        invoice_items: true,
      },
    })
    if (!invoice) {
      return { success: false, message: "Invoice not found" }
    }
    
    // Transform invoice to include client data in expected format
    const transformedInvoice = {
      ...invoice,
      client_name: invoice.clients?.name || 'Unknown Client',
      client_email: invoice.clients?.email || '',
      items: invoice.invoice_items || [],
    }
    
    return { success: true, invoice: transformedInvoice }
  } catch (error) {
    console.error("Get invoice error:", error)
    return { success: false, message: "Failed to fetch invoice" }
  }
}

export async function createInvoice(data: {
  invoice_number: string
  client_id: number
  issue_date: string
  due_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  notes?: string
  items: InvoiceItem[]
}) {
  try {
    // Create invoice
    const invoiceResult = await prisma.invoices.create({
      data: {
        invoice_number: data.invoice_number,
        client_id: data.client_id,
        issue_date: data.issue_date,
        due_date: data.due_date,
        subtotal: data.subtotal,
        tax_rate: data.tax_rate,
        tax_amount: data.tax_amount,
        total: data.total,
        notes: data.notes || null,
      },
    })

    const invoiceId = invoiceResult.id

    // Create invoice items
    for (const item of data.items) {
      await prisma.invoice_items.create({
        data: {
          invoice_id: invoiceId,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        },
      })
    }

    return {
      success: true,
      message: "Invoice created successfully",
      invoiceId,
    }
  } catch (error) {
    console.error("Create invoice error:", error)
    return { success: false, message: "Failed to create invoice" }
  }
}

export async function updateInvoice(
  id: number,
  data: {
    invoice_number: string
    client_id: number
    issue_date: string
    due_date: string
    subtotal: number
    tax_rate: number
    tax_amount: number
    total: number
    status?: "draft" | "sent" | "viewed" | "paid" | "overdue"
    notes?: string
    items: InvoiceItem[]
  },
) {
  try {
    // Update invoice
    const invoiceResult = await prisma.invoices.update({
      where: { id },
      data: {
        invoice_number: data.invoice_number,
        client_id: data.client_id,
        issue_date: data.issue_date,
        due_date: data.due_date,
        subtotal: data.subtotal,
        tax_rate: data.tax_rate,
        tax_amount: data.tax_amount,
        total: data.total,
        status: data.status,
        notes: data.notes || null,
      },
    })

    // Delete existing invoice items
    await prisma.invoice_items.deleteMany({
      where: { invoice_id: id },
    })

    // Create new invoice items
    for (const item of data.items) {
      await prisma.invoice_items.create({
        data: {
          invoice_id: id,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
        },
      })
    }

    return { success: true, message: "Invoice updated successfully" }
  } catch (error) {
    console.error("Update invoice error:", error)
    return { success: false, message: "Failed to update invoice" }
  }
}

export async function updateInvoiceStatus(id: number, status: "draft" | "sent" | "viewed" | "paid" | "overdue") {
  try {
    await prisma.invoices.update({
      where: { id },
      data: { status },
    })

    return { success: true, message: "Invoice status updated successfully" }
  } catch (error) {
    console.error("Update invoice status error:", error)
    return { success: false, message: "Failed to update invoice status" }
  }
}

/**
 * Mark an invoice as paid
 */
export async function markInvoiceAsPaid(id: number) {
  return updateInvoiceStatus(id, "paid");
}

/**
 * Send a reminder email for an invoice
 */
export async function sendInvoiceReminder(id: number, customMessage?: string) {
  try {
    // Get invoice details with client information
    const invoice = await prisma.invoices.findUnique({
      where: { id },
      include: {
        clients: true,
      },
    })

    if (!invoice) {
      return { success: false, message: "Invoice not found" }
    }

    // Check if client has an email
    if (!invoice.clients?.email) {
      return { success: false, message: "Client does not have an email address" }
    }

    // Import professional templates
    const { 
      getTemplateById, 
      populateTemplate,
      defaultTemplateVariables 
    } = await import('@/lib/email-templates/professional-suite');

    // Use respectful reminder template by default
    const template = getTemplateById('respectful-payment-reminder');
    if (!template) {
      return { success: false, message: "Email template not found" };
    }

    const daysSinceLastContact = Math.floor(
      (Date.now() - invoice.due_date.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Prepare template variables
    const templateVariables = {
      ...defaultTemplateVariables,
      client_name: invoice.clients.name,
      company_name: 'AutoFlow Solutions',
      invoice_number: invoice.invoice_number,
      amount: `$${Number(invoice.total).toFixed(2)}`,
      project_name: invoice.notes || 'Professional Services',
      due_date: invoice.due_date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      days_overdue: daysSinceLastContact.toString(),
      key_deliverable_1: 'Strategic consultation and analysis',
      key_deliverable_2: 'Custom solution implementation',
      key_deliverable_3: 'Quality assurance and optimization',
      payment_link: 'https://autoflow.com/pay/' + invoice.invoice_number,
      bank_details: 'Available in client portal',
      payment_phone: '+1 (555) 123-4567',
      ...(customMessage && { custom_message: customMessage })
    };

    // Populate the template
    const populatedTemplate = populateTemplate(template, templateVariables);

    // Create professional HTML reminder content
    const professionalReminderContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${populatedTemplate.subject}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 650px; 
            margin: 0 auto; 
            background-color: #f8f9fa;
          }
          .email-container {
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            margin: 20px;
          }
          .header {
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            color: white;
            padding: 25px 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
          }
          .header p {
            margin: 5px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .content {
            padding: 35px 30px;
          }
          .reminder-badge {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 1px solid #f39c12;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .reminder-badge strong {
            color: #b8860b;
            font-size: 16px;
          }
          .invoice-details {
            background: #f8f9fa;
            border-left: 4px solid #f39c12;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
          }
          .invoice-details p {
            margin: 8px 0;
            display: flex;
            justify-content: space-between;
          }
          .invoice-details strong {
            color: #333;
          }
          .payment-options {
            background: #e8f5e8;
            border: 1px solid #28a745;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
          }
          .payment-options h4 {
            color: #155724;
            margin: 0 0 15px 0;
          }
          .payment-options ul {
            margin: 0;
            padding-left: 20px;
          }
          .payment-options li {
            margin: 8px 0;
            color: #155724;
          }
          .cta-section {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 25px;
            text-align: center;
            margin: 25px 0;
            border-radius: 8px;
          }
          .cta-button {
            display: inline-block;
            background: white;
            color: #28a745;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 10px;
          }
          .signature {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-top: 3px solid #f39c12;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
            color: #666;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Payment Reminder</h1>
            <p>Friendly Partnership Communication</p>
          </div>
          
          <div class="content">
            ${populatedTemplate.body.split('\n').map(line => {
              if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
                return `<h3 style="color: #f39c12; margin: 20px 0 12px 0;">${line.replace(/\*\*/g, '')}</h3>`;
              }
              if (line.trim().startsWith('•')) {
                return `<div style="margin: 6px 0; padding-left: 15px;">• ${line.substring(1).trim()}</div>`;
              }
              if (line.trim().startsWith('✓')) {
                return `<div style="margin: 6px 0; color: #28a745; font-weight: 500;">${line}</div>`;
              }
              return line.trim() ? `<p style="margin: 10px 0;">${line}</p>` : '<br>';
            }).join('')}
            
            <div class="reminder-badge">
              <strong>Friendly Reminder: Payment Due</strong>
            </div>
            
            <div class="invoice-details">
              <p><strong>Invoice Number:</strong> <span>${invoice.invoice_number}</span></p>
              <p><strong>Amount Due:</strong> <span style="font-size: 18px; color: #f39c12; font-weight: bold;">$${Number(invoice.total).toFixed(2)}</span></p>
              <p><strong>Original Due Date:</strong> <span>${invoice.due_date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
              <p><strong>Days Outstanding:</strong> <span style="color: #dc3545; font-weight: bold;">${daysSinceLastContact} days</span></p>
              <p><strong>Project:</strong> <span>${invoice.notes || 'Professional Services'}</span></p>
            </div>
            
            ${customMessage ? `
              <div style="background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1976d2;">Personal Message:</h4>
                <p style="margin: 0; font-style: italic; color: #1976d2;">${customMessage}</p>
              </div>
            ` : ''}
            
            <div class="payment-options">
              <h4>Easy Payment Options:</h4>
              <ul>
                <li>💳 <strong>Online Payment Portal:</strong> Secure, instant processing</li>
                <li>🏦 <strong>Bank Transfer:</strong> Direct transfer to our account</li>
                <li>📞 <strong>Phone Payment:</strong> Call us at ${templateVariables.payment_phone}</li>
                <li>💌 <strong>Check Payment:</strong> Mail to our business address</li>
              </ul>
            </div>
          </div>
          
          <div class="cta-section">
            <h3 style="margin: 0 0 8px 0;">Ready to Complete Payment?</h3>
            <p style="margin: 0; opacity: 0.9; font-size: 14px;">Secure payment processing available 24/7</p>
            <a href="${templateVariables.payment_link}" class="cta-button">Pay Now - Secure Portal</a>
          </div>
          
          <div class="signature">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="flex: 1;">
                <div style="font-weight: 600; color: #f39c12; font-size: 16px;">${templateVariables.signature}</div>
                <div style="color: #666; margin: 3px 0;">${templateVariables.title}</div>
                <div style="color: #666; font-size: 14px;">${templateVariables.company_name}</div>
              </div>
              <div style="text-align: right; color: #666; font-size: 13px;">
                <div>📞 ${templateVariables.direct_phone}</div>
                <div>✉️ ${templateVariables.direct_email}</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0;"><strong>${templateVariables.company_name}</strong> - Your Trusted Partner</p>
            <p style="margin: 5px 0 0 0;">We appreciate your business and prompt attention to this matter.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the reminder email
    const { sendEmail } = await import('@/lib/email')
    const emailResult = await sendEmail({
      to: invoice.clients.email,
      subject: populatedTemplate.subject,
      html: professionalReminderContent,
    })

    if (!emailResult.success) {
      console.error("Email failed to send:", emailResult.error)
      return { 
        success: false, 
        message: "Failed to send reminder email", 
        error: emailResult.error 
      }
    }

    // Update invoice status to "sent" if it was in "draft" status
    if (invoice.status === 'draft') {
      await updateInvoiceStatus(id, 'sent')
    }

    // Log the email in email_logs if the table exists
    try {
      await prisma.email_logs.create({
        data: {
          email_template_id: null,
          recipient: invoice.clients.email,
          subject: populatedTemplate.subject,
          body: professionalReminderContent,
          status: 'sent',
        },
      })
    } catch (error) {
      // If email_logs table doesn't exist or other error, just log to console
      console.log("Could not log email to database:", error)
    }

    return { 
      success: true, 
      message: `Professional reminder email sent to ${invoice.clients?.name} (${invoice.clients?.email})`,
      template: populatedTemplate.name
    }
  } catch (error) {
    console.error("Send invoice reminder error:", error)
    return { success: false, message: "Failed to send reminder email" }
  }
}

export async function deleteInvoice(id: number) {
  try {
    await prisma.invoices.delete({
      where: { id },
    })

    return { success: true, message: "Invoice deleted successfully" }
  } catch (error) {
    console.error("Delete invoice error:", error)
    return { success: false, message: "Failed to delete invoice" }
  }
}

export async function getDashboardStats() {
  try {
    // Get total revenue (sum of paid invoices)
    const revenueResult = await prisma.invoices.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: 'paid',
      },
    })

    // Get current month start and end dates
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Get revenue from current month
    const currentMonthRevenueResult = await prisma.invoices.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: 'paid',
        updated_at: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    })

    // Get active clients count (clients with invoices in the last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const activeClientsResult = await prisma.invoices.findMany({
      select: {
        client_id: true,
      },
      where: {
        created_at: {
          gte: sixMonthsAgo,
        },
      },
      distinct: ['client_id'],
    })

    // Get pending invoices count and total (status is 'sent' in database)
    const pendingResult = await prisma.invoices.aggregate({
      _count: true,
      _sum: {
        total: true,
      },
      where: {
        status: 'sent',
      },
    })

    // Get paid invoices count and total (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const paidResult = await prisma.invoices.aggregate({
      _count: true,
      _sum: {
        total: true,
      },
      where: {
        status: 'paid',
        updated_at: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Get overdue invoices count and total
    const overdueResult = await prisma.invoices.aggregate({
      _count: true,
      _sum: {
        total: true,
      },
      where: {
        status: 'overdue',
      },
    })

    // Get recent invoices with client information
    const recentInvoices = await prisma.invoices.findMany({
      include: {
        clients: true,
      },
      orderBy: { created_at: 'desc' },
      take: 5,
    })

    // Transform recent invoices to match expected format
    const transformedRecentInvoices = recentInvoices.map((invoice: any) => ({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      client: invoice.clients?.name || 'Unknown Client',
      amount: Number(invoice.total),
      status: invoice.status,
      due_date: invoice.due_date,
    }))

    return {
      success: true,
      stats: {
        totalRevenue: Number(revenueResult._sum.total || 0),
        activeClients: activeClientsResult.length,
        pendingInvoices: {
          count: pendingResult._count || 0,
          total: Number(pendingResult._sum.total || 0),
        },
        paidInvoices: {
          count: paidResult._count || 0,
          total: Number(paidResult._sum.total || 0),
        },
        overdueInvoices: {
          count: overdueResult._count || 0,
          total: Number(overdueResult._sum.total || 0),
        },
        recentInvoices: transformedRecentInvoices,
      },
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return { success: false, message: "Failed to fetch dashboard stats" }
  }
}
