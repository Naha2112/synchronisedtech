"use server"

import { requireAuth } from "@/lib/server-auth"

/**
 * Get current user data
 */
export async function getUserData() {
  try {
    // Get the authenticated user
    const user = await requireAuth()
    
    return { success: true, user }
  } catch (error) {
    console.error("Get user data error:", error)
    return { success: false, message: "Failed to fetch user data" }
  }
} 