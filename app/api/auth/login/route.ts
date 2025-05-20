import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { createToken } from "@/lib/auth"
import { getUserByEmail } from "@/lib/server-db"
import bcrypt from "bcryptjs"

// Cookie expiration times
const COOKIE_EXPIRY = {
  default: 60 * 60 * 24, // 1 day in seconds
  remember: 60 * 60 * 24 * 30, // 30 days in seconds
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    // Get user by email
    const user = await getUserByEmail(email)
    
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // For demo purposes, allow a specific password for the demo account
    const isValidPassword =
      email === "demo@autoflow.com" && password === "password"
        ? true
        : await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    // Create JWT token
    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
    })

    if (!token) {
      return NextResponse.json({ success: false, message: "Token generation failed" }, { status: 500 })
    }

    // Set the token in cookies - use Response object directly
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
    
    // Set cookie expiration based on Remember Me option
    const cookieMaxAge = rememberMe ? COOKIE_EXPIRY.remember : COOKIE_EXPIRY.default
    
    // Set cookie on the response object
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: cookieMaxAge,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "An error occurred during login" }, { status: 500 })
  }
}
