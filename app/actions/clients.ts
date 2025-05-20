"use server"

import { query } from "@/lib/db"
import { requireAuth } from "@/lib/server-auth"

export type Client = {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  created_at: string
}

export async function getClients() {
  const user = await requireAuth()

  try {
    const clients = await query("SELECT * FROM clients WHERE created_by = ? ORDER BY name ASC", [user.id])

    return { success: true, clients }
  } catch (error) {
    console.error("Get clients error:", error)
    return { success: false, message: "Failed to fetch clients" }
  }
}

export async function getClient(id: number) {
  const user = await requireAuth()

  try {
    const clients = (await query("SELECT * FROM clients WHERE id = ? AND created_by = ?", [id, user.id])) as any[]

    if (clients.length === 0) {
      return { success: false, message: "Client not found" }
    }

    return { success: true, client: clients[0] }
  } catch (error) {
    console.error("Get client error:", error)
    return { success: false, message: "Failed to fetch client" }
  }
}

export async function createClient(data: {
  name: string
  email: string
  phone?: string
  address?: string
}) {
  const user = await requireAuth()

  try {
    const result = (await query(
      "INSERT INTO clients (name, email, phone, address, created_by) VALUES (?, ?, ?, ?, ?)",
      [data.name, data.email, data.phone || null, data.address || null, user.id],
    )) as any

    return {
      success: true,
      message: "Client created successfully",
      clientId: result.insertId,
    }
  } catch (error) {
    console.error("Create client error:", error)
    return { success: false, message: "Failed to create client" }
  }
}

export async function updateClient(
  id: number,
  data: {
    name: string
    email: string
    phone?: string
    address?: string
  },
) {
  const user = await requireAuth()

  try {
    await query("UPDATE clients SET name = ?, email = ?, phone = ?, address = ? WHERE id = ? AND created_by = ?", [
      data.name,
      data.email,
      data.phone || null,
      data.address || null,
      id,
      user.id,
    ])

    return { success: true, message: "Client updated successfully" }
  } catch (error) {
    console.error("Update client error:", error)
    return { success: false, message: "Failed to update client" }
  }
}

export async function deleteClient(id: number) {
  const user = await requireAuth()

  try {
    // Check if client has invoices
    const invoices = (await query("SELECT COUNT(*) as count FROM invoices WHERE client_id = ?", [id])) as any[]

    if (invoices[0].count > 0) {
      return {
        success: false,
        message: "Cannot delete client with existing invoices",
      }
    }

    await query("DELETE FROM clients WHERE id = ? AND created_by = ?", [id, user.id])

    return { success: true, message: "Client deleted successfully" }
  } catch (error) {
    console.error("Delete client error:", error)
    return { success: false, message: "Failed to delete client" }
  }
}
