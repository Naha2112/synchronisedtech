import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { getUserById } from "@/lib/server-db"

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies on the request
    const token = request.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    // Verify token
    const payload = await verifyToken(token)
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }

    // Get user data
    const user = await getUserById(Number(payload.id))
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Return user data (without sensitive information)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ success: false, message: "An error occurred while fetching user data" }, { status: 500 })
  }
} 