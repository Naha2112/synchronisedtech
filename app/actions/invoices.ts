"use server"

import { query } from "@/lib/server-db"
import { requireAuth } from "@/lib/server-auth"

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
  const user = await requireAuth()

  try {
    const invoices = (await query(
      `
      SELECT i.*, c.name as client_name, c.email as client_email
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.created_by = ?
      ORDER BY i.created_at DESC
    `,
      [user.id],
    )) as any[]

    return { success: true, invoices }
  } catch (error) {
    console.error("Get invoices error:", error)
    return { success: false, message: "Failed to fetch invoices" }
  }
}

export async function getInvoice(id: number) {
  const user = await requireAuth()

  try {
    // Get invoice details
    const invoices = (await query(
      `
      SELECT i.*, c.name as client_name, c.email as client_email
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.id = ? AND i.created_by = ?
    `,
      [id, user.id],
    )) as any[]

    if (invoices.length === 0) {
      return { success: false, message: "Invoice not found" }
    }

    const invoice = invoices[0]

    // Get invoice items
    const items = await query("SELECT * FROM invoice_items WHERE invoice_id = ?", [id])

    invoice.items = items

    return { success: true, invoice }
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
  const user = await requireAuth()

  try {
    // Start a transaction
    const connection = await (await import("@/lib/db")).createConnection()
    await connection.beginTransaction()

    try {
      // Create invoice
      const [invoiceResult] = (await connection.execute(
        `INSERT INTO invoices 
        (invoice_number, client_id, issue_date, due_date, subtotal, tax_rate, tax_amount, total, notes, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.invoice_number,
          data.client_id,
          data.issue_date,
          data.due_date,
          data.subtotal,
          data.tax_rate,
          data.tax_amount,
          data.total,
          data.notes || null,
          user.id,
        ],
      )) as any

      const invoiceId = invoiceResult.insertId

      // Create invoice items
      for (const item of data.items) {
        await connection.execute(
          `INSERT INTO invoice_items 
          (invoice_id, description, quantity, rate, amount) 
          VALUES (?, ?, ?, ?, ?)`,
          [invoiceId, item.description, item.quantity, item.rate, item.amount],
        )
      }

      // Commit the transaction
      await connection.commit()

      return {
        success: true,
        message: "Invoice created successfully",
        invoiceId,
      }
    } catch (error) {
      // Rollback the transaction on error
      await connection.rollback()
      throw error
    } finally {
      await connection.end()
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
  const user = await requireAuth()

  try {
    // Start a transaction
    const connection = await (await import("@/lib/db")).createConnection()
    await connection.beginTransaction()

    try {
      // Update invoice
      await connection.execute(
        `UPDATE invoices SET 
        invoice_number = ?, client_id = ?, issue_date = ?, due_date = ?, 
        subtotal = ?, tax_rate = ?, tax_amount = ?, total = ?, 
        ${data.status ? "status = ?," : ""} notes = ?
        WHERE id = ? AND created_by = ?`,
        [
          data.invoice_number,
          data.client_id,
          data.issue_date,
          data.due_date,
          data.subtotal,
          data.tax_rate,
          data.tax_amount,
          data.total,
          ...(data.status ? [data.status] : []),
          data.notes || null,
          id,
          user.id,
        ],
      )

      // Delete existing invoice items
      await connection.execute("DELETE FROM invoice_items WHERE invoice_id = ?", [id])

      // Create new invoice items
      for (const item of data.items) {
        await connection.execute(
          `INSERT INTO invoice_items 
          (invoice_id, description, quantity, rate, amount) 
          VALUES (?, ?, ?, ?, ?)`,
          [id, item.description, item.quantity, item.rate, item.amount],
        )
      }

      // Commit the transaction
      await connection.commit()

      return { success: true, message: "Invoice updated successfully" }
    } catch (error) {
      // Rollback the transaction on error
      await connection.rollback()
      throw error
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Update invoice error:", error)
    return { success: false, message: "Failed to update invoice" }
  }
}

export async function updateInvoiceStatus(id: number, status: "draft" | "sent" | "viewed" | "paid" | "overdue") {
  const user = await requireAuth()

  try {
    await query("UPDATE invoices SET status = ? WHERE id = ? AND created_by = ?", [status, id, user.id])

    return { success: true, message: "Invoice status updated successfully" }
  } catch (error) {
    console.error("Update invoice status error:", error)
    return { success: false, message: "Failed to update invoice status" }
  }
}

export async function deleteInvoice(id: number) {
  const user = await requireAuth()

  try {
    await query("DELETE FROM invoices WHERE id = ? AND created_by = ?", [id, user.id])

    return { success: true, message: "Invoice deleted successfully" }
  } catch (error) {
    console.error("Delete invoice error:", error)
    return { success: false, message: "Failed to delete invoice" }
  }
}

export async function getDashboardStats() {
  const user = await requireAuth()

  try {
    // Get total revenue (sum of paid invoices)
    const revenueResult = (await query(
      `
      SELECT SUM(total) as total_revenue
      FROM invoices
      WHERE created_by = ? AND status = 'paid'
    `,
      [user.id],
    )) as any[]

    // Get revenue from previous month
    const previousMonthRevenueResult = (await query(
      `
      SELECT SUM(total) as prev_month_revenue
      FROM invoices
      WHERE created_by = ? AND status = 'paid'
      AND updated_at BETWEEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 2 MONTH), '%Y-%m-01')
      AND LAST_DAY(DATE_SUB(NOW(), INTERVAL 2 MONTH))
      `,
      [user.id],
    )) as any[]

    // Get revenue from current month
    const currentMonthRevenueResult = (await query(
      `
      SELECT SUM(total) as current_month_revenue
      FROM invoices
      WHERE created_by = ? AND status = 'paid'
      AND updated_at BETWEEN DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
      AND LAST_DAY(DATE_SUB(NOW(), INTERVAL 1 MONTH))
      `,
      [user.id],
    )) as any[]

    // Calculate percentage change
    const prevRevenue = previousMonthRevenueResult[0].prev_month_revenue || 0;
    const currRevenue = currentMonthRevenueResult[0].current_month_revenue || 0;
    let revenueChangePercent = 0;
    
    if (prevRevenue > 0) {
      revenueChangePercent = Math.round(((currRevenue - prevRevenue) / prevRevenue) * 100);
    } else if (currRevenue > 0) {
      revenueChangePercent = 100; // If no previous revenue but current revenue exists, it's a 100% increase
    }

    // Get pending invoices count and total
    const pendingResult = (await query(
      `
      SELECT COUNT(*) as count, SUM(total) as total
      FROM invoices
      WHERE created_by = ? AND status = 'sent'
    `,
      [user.id],
    )) as any[]

    // Get paid invoices count in last 30 days
    const paidResult = (await query(
      `
      SELECT COUNT(*) as count
      FROM invoices
      WHERE created_by = ? AND status = 'paid' 
      AND updated_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `,
      [user.id],
    )) as any[]

    // Get overdue invoices count and total
    const overdueResult = (await query(
      `
      SELECT COUNT(*) as count, SUM(total) as total
      FROM invoices
      WHERE created_by = ? AND status = 'overdue'
    `,
      [user.id],
    )) as any[]

    // Get recent invoices
    const recentInvoices = (await query(
      `
      SELECT i.id, i.invoice_number, c.name as client, i.total as amount, i.status, i.due_date
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.created_by = ?
      ORDER BY i.created_at DESC
      LIMIT 5
    `,
      [user.id],
    )) as any[]

    return {
      success: true,
      stats: {
        totalRevenue: revenueResult[0].total_revenue || 0,
        revenueChangePercent: revenueChangePercent,
        pendingInvoices: {
          count: pendingResult[0].count || 0,
          total: pendingResult[0].total || 0,
        },
        paidInvoices: {
          count: paidResult[0].count || 0,
        },
        overdueInvoices: {
          count: overdueResult[0].count || 0,
          total: overdueResult[0].total || 0,
        },
        recentInvoices,
      },
    }
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return { success: false, message: "Failed to fetch dashboard stats" }
  }
}
