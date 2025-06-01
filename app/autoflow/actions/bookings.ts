"use server"

import { query } from "@/lib/db"

export type Booking = {
  id: number
  title: string
  description: string | null
  start_time: string
  end_time: string
  client_id: number
  client_name?: string
  client_email?: string
  status: "scheduled" | "confirmed" | "cancelled" | "completed"
  location: string | null
  notes: string | null
  created_by: number
  created_at: string
  updated_at: string
}

export async function getBookings(
  startDate?: string, 
  endDate?: string,
  clientId?: number
) {
  try {
    let sql = `
      SELECT b.*, c.name as client_name, c.email as client_email 
      FROM bookings b
      JOIN clients c ON b.client_id = c.id
    `
    const params: any[] = []

    if (startDate) {
      sql += " AND b.start_time >= ?"
      params.push(startDate)
    }

    if (endDate) {
      sql += " AND b.start_time <= ?"
      params.push(endDate)
    }

    if (clientId) {
      sql += " AND b.client_id = ?"
      params.push(clientId)
    }

    sql += " ORDER BY b.start_time ASC"

    const bookings = await query(sql, params)

    return { success: true, bookings }
  } catch (error) {
    console.error("Get bookings error:", error)
    return { success: false, message: "Failed to fetch bookings" }
  }
}

export async function getBooking(id: number) {
  try {
    const result = await query(`
      SELECT b.*, c.name as client_name, c.email as client_email 
      FROM bookings b
      JOIN clients c ON b.client_id = c.id
      WHERE b.id = ?
    `, [id])

    const bookings = result as any[]

    if (bookings.length === 0) {
      return { success: false, message: "Booking not found" }
    }

    return { success: true, booking: bookings[0] }
  } catch (error) {
    console.error("Get booking error:", error)
    return { success: false, message: "Failed to fetch booking" }
  }
}

export async function createBooking(data: {
  title: string
  description?: string
  start_time: string
  end_time: string
  client_id: number
  status?: "scheduled" | "confirmed" | "cancelled" | "completed"
  location?: string
  notes?: string
}) {
  try {
    // Validate dates
    const startTime = new Date(data.start_time)
    const endTime = new Date(data.end_time)

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return { success: false, message: "Invalid date format" }
    }

    if (startTime >= endTime) {
      return { success: false, message: "End time must be after start time" }
    }

    // Format dates for MySQL (YYYY-MM-DD HH:MM:SS)
    const formatDateForMySQL = (date: Date) => {
      return date.toISOString().slice(0, 19).replace('T', ' ')
    }

    const mysqlStartTime = formatDateForMySQL(startTime)
    const mysqlEndTime = formatDateForMySQL(endTime)

    // Check for overlapping bookings
    const overlaps = await query(`
      SELECT COUNT(*) as count FROM bookings 
      WHERE ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))
    `, [
      mysqlEndTime, mysqlStartTime, 
      mysqlEndTime, mysqlStartTime
    ]) as any[]

    if (overlaps[0].count > 0) {
      return { success: false, message: "This booking overlaps with an existing booking" }
    }

    const result = await query(`
      INSERT INTO bookings 
      (title, description, start_time, end_time, client_id, status, location, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      data.title,
      data.description || null,
      mysqlStartTime,
      mysqlEndTime,
      data.client_id,
      data.status || "scheduled",
      data.location || null,
      data.notes || null
    ]) as any

    return {
      success: true,
      message: "Booking created successfully",
      bookingId: result.insertId
    }
  } catch (error) {
    console.error("Create booking error:", error)
    return { success: false, message: "Failed to create booking" }
  }
}

export async function updateBooking(
  id: number,
  data: {
    title?: string
    description?: string
    start_time?: string
    end_time?: string
    client_id?: number
    status?: "scheduled" | "confirmed" | "cancelled" | "completed"
    location?: string
    notes?: string
  }
) {
  try {
    // Verify booking exists
    const bookingResult = await query(
      "SELECT * FROM bookings WHERE id = ?", 
      [id]
    ) as any[]

    if (bookingResult.length === 0) {
      return { success: false, message: "Booking not found" }
    }

    const booking = bookingResult[0]
    
    // Format dates for MySQL (YYYY-MM-DD HH:MM:SS)
    const formatDateForMySQL = (date: Date) => {
      return date.toISOString().slice(0, 19).replace('T', ' ')
    }
    
    // Validate dates if provided
    let startTime = booking.start_time
    let endTime = booking.end_time
    let mysqlStartTime = startTime
    let mysqlEndTime = endTime
    
    if (data.start_time) {
      startTime = new Date(data.start_time)
      if (isNaN(startTime.getTime())) {
        return { success: false, message: "Invalid start time format" }
      }
      mysqlStartTime = formatDateForMySQL(startTime)
    }
    
    if (data.end_time) {
      endTime = new Date(data.end_time)
      if (isNaN(endTime.getTime())) {
        return { success: false, message: "Invalid end time format" }
      }
      mysqlEndTime = formatDateForMySQL(endTime)
    }
    
    if (startTime >= endTime) {
      return { success: false, message: "End time must be after start time" }
    }

    // Check for overlapping bookings if dates changed
    if (data.start_time || data.end_time) {
      const overlaps = await query(`
        SELECT COUNT(*) as count FROM bookings 
        WHERE id != ?
        AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))
      `, [
        id,
        mysqlEndTime, 
        mysqlStartTime, 
        mysqlEndTime, 
        mysqlStartTime
      ]) as any[]

      if (overlaps[0].count > 0) {
        return { success: false, message: "This booking overlaps with an existing booking" }
      }
    }

    // Build update query dynamically
    const updates: string[] = []
    const params: any[] = []

    if (data.title !== undefined) {
      updates.push("title = ?")
      params.push(data.title)
    }

    if (data.description !== undefined) {
      updates.push("description = ?")
      params.push(data.description || null)
    }

    if (data.start_time !== undefined) {
      updates.push("start_time = ?")
      params.push(mysqlStartTime)
    }

    if (data.end_time !== undefined) {
      updates.push("end_time = ?")
      params.push(mysqlEndTime)
    }

    if (data.client_id !== undefined) {
      updates.push("client_id = ?")
      params.push(data.client_id)
    }

    if (data.status !== undefined) {
      updates.push("status = ?")
      params.push(data.status)
    }

    if (data.location !== undefined) {
      updates.push("location = ?")
      params.push(data.location || null)
    }

    if (data.notes !== undefined) {
      updates.push("notes = ?")
      params.push(data.notes || null)
    }

    if (updates.length === 0) {
      return { success: true, message: "No changes to update" }
    }

    // Add params for WHERE clause
    params.push(id)

    await query(
      `UPDATE bookings SET ${updates.join(", ")} WHERE id = ?`,
      params
    )

    return { success: true, message: "Booking updated successfully" }
  } catch (error) {
    console.error("Update booking error:", error)
    return { success: false, message: "Failed to update booking" }
  }
}

export async function deleteBooking(id: number) {
  try {
    // Verify booking exists
    const result = await query(
      "SELECT id FROM bookings WHERE id = ?", 
      [id]
    ) as any[]

    if (result.length === 0) {
      return { success: false, message: "Booking not found" }
    }

    await query("DELETE FROM bookings WHERE id = ?", [id])

    return { success: true, message: "Booking deleted successfully" }
  } catch (error) {
    console.error("Delete booking error:", error)
    return { success: false, message: "Failed to delete booking" }
  }
}

export async function getBookingsForDashboard(limit = 5) {
  try {
    const bookings = await query(`
      SELECT b.*, c.name as client_name, c.email as client_email 
      FROM bookings b
      JOIN clients c ON b.client_id = c.id
      WHERE b.start_time >= CURDATE()
      ORDER BY b.start_time ASC
      LIMIT ?
    `, [limit])

    return { success: true, bookings }
  } catch (error) {
    console.error("Get upcoming bookings error:", error)
    return { success: false, bookings: [], message: "Failed to fetch upcoming bookings" }
  }
} 