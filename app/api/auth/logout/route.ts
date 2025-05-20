import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Create response object
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })

    // Clear the auth token cookie
    response.cookies.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0), // Set expiration to past date to delete cookie
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred during logout" },
      { status: 500 }
    )
  }
}
