import { NextRequest, NextResponse } from "next/server";
import { createConnection } from "@/lib/db";

export async function POST(request: NextRequest) {
  let connection;
  try {
    // Parse request body
    const body = await request.json();
    const { clientName, description, amount, taxRate = 0 } = body;

    console.log("Creating invoice with:", { clientName, description, amount });

    if (!clientName || !description || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing required fields: clientName, description, amount" },
        { status: 400 }
      );
    }

    // Get direct database connection
    connection = await createConnection();
    
    // Use a default created_by value for public/demo mode
    const createdBy = 1;
    // Find client by name or create if doesn't exist
    let clientId;
    const [existingClients] = await connection.execute(
      "SELECT id FROM clients WHERE name LIKE ? AND created_by = ? LIMIT 1",
      [`%${clientName}%`, createdBy]
    );

    if ((existingClients as any[]).length > 0) {
      clientId = (existingClients as any[])[0].id;
    } else {
      // Create new client if no match
      const [newClientResult] = await connection.execute(
        "INSERT INTO clients (name, email, created_by) VALUES (?, ?, ?)",
        [clientName, "", createdBy]
      );
      clientId = (newClientResult as any).insertId;
    }

    // Generate invoice number (simple format: INV-YYYY-MM-XXXX)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Get count of invoices to make sequential number
    const [invoiceCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM invoices WHERE created_by = ?",
      [createdBy]
    );
    
    const count = (invoiceCount as any[])[0]?.count || 0;
    const invoiceNumber = `INV-${year}-${month}-${String(count + 1).padStart(4, '0')}`;
    
    // Set due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    
    // Convert amount to decimal
    const subtotal = parseFloat(amount);
    
    // Calculate tax if applicable
    const taxAmount = subtotal * (parseFloat(taxRate) / 100);
    const total = subtotal + taxAmount;

    // Create invoice with properly formatted dates
    const today = new Date().toISOString().split('T')[0];
    const dueDateStr = dueDate.toISOString().split('T')[0];
    
    console.log("Inserting invoice with dates:", { today, dueDateStr });
    
    const [result] = await connection.execute(
      `INSERT INTO invoices 
       (invoice_number, client_id, issue_date, due_date, subtotal, tax_rate, tax_amount, total, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        invoiceNumber,
        clientId,
        today,
        dueDateStr,
        subtotal,
        taxRate,
        taxAmount,
        total,
        "draft",
        createdBy
      ]
    );

    const invoiceId = (result as any).insertId;

    // Add line item
    await connection.execute(
      `INSERT INTO invoice_items 
       (invoice_id, description, quantity, rate, amount) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        invoiceId,
        description,
        1, // Default quantity
        subtotal,
        subtotal
      ]
    );

    console.log("Invoice created successfully:", { invoiceId, invoiceNumber });

    return NextResponse.json({
      success: true,
      message: "Invoice created successfully",
      invoiceId,
      invoiceNumber,
      total
    });
  } catch (error) {
    console.error("Create invoice error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create invoice", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
} 