import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "./auth"
import { getUserById } from "./server-db"
import "server-only"

// Get auth cookie directly with proper error handling for Next.js 15
async function getAuthCookie() {
  try {
    // In Next.js 15, cookies() must be awaited
    const cookiesStore = await cookies();
    return cookiesStore.get("auth_token")?.value;
  } catch (error) {
    console.error("Error getting auth cookie:", error);
    return null;
  }
}

// Server-only version of getCurrentUser
export async function getCurrentUser() {
  try {
    // Get auth cookie
    const token = await getAuthCookie();

    if (!token) {
      return null;
    }
    
    // Verify token
    const payload = await verifyToken(token);
    if (!payload || !payload.id) {
      return null;
    }
    
    // Get user data
    return await getUserById(Number(payload.id));
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

// Server-only version of requireAuth
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
} 