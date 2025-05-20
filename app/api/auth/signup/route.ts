import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/server-db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUsers = await query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    ) as any[]

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const result = await query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    ) as any

    if (!result.insertId) {
      throw new Error("Failed to create user")
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred during signup" },
      { status: 500 }
    )
  }
} 