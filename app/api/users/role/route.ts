import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Update user role (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Get the role change request data
    const { userId, newRole } = await request.json()

    // Validate the new role
    if (!["admin", "manager", "user"].includes(newRole)) {
      return NextResponse.json(
        { success: false, message: "Invalid role specified" },
        { status: 400 }
      )
    }

    // Update the user's role in the database
    await prisma.user.update({ where: { id: userId }, data: { role: newRole } })

    return NextResponse.json({ success: true, message: "User role updated successfully" })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update user role" },
      { status: 500 }
    )
  }
}

// Get all users with their roles (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    )
  }
} 