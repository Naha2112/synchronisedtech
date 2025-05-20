import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { query } from "./server-db"

// Types
export type User = {
  id: number
  name: string
  email: string
}

// Create a JWT token
export async function createToken(user: User) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only")
  const token = await new SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)

  return token
}

// Verify a JWT token
export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only")
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

// Login user
export async function login(email: string, password: string) {
  try {
    const users = (await query("SELECT id, name, email, password_hash FROM users WHERE email = ?", [email])) as any[]

    if (users.length === 0) {
      return { success: false, message: "Invalid credentials" }
    }

    const user = users[0]

    // For demo purposes, allow a specific password for the demo account
    const isValidPassword =
      email === "demo@autoflow.com" && password === "password"
        ? true
        : await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return { success: false, message: "Invalid credentials" }
    }

    // Create JWT token 
    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
    })

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "An error occurred during login" }
  }
}

// Get user by ID
export async function getUserById(userId: number) {
  try {
    const users = (await query("SELECT id, name, email FROM users WHERE id = ?", [userId])) as any[]

    if (users.length === 0) {
      return null
    }

    return users[0] as User
  } catch (error) {
    console.error("Get user error:", error)
    return null
  }
}

// Get current user from token
export async function getCurrentUserFromToken(token: string) {
  if (!token) {
    return null
  }

  try {
    const payload = await verifyToken(token)
    if (!payload || !payload.id) {
      return null
    }

    return await getUserById(Number(payload.id))
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Helper function for redirect
export function redirectToLogin() {
  redirect("/login")
}

// Client-side version of requireAuth that gets user via API
export async function requireAuth() {
  try {
    // Add safeguards for client vs server environments
    // During SSR this won't execute (would use server-auth.ts instead)
    if (typeof window === 'undefined') {
      console.warn('requireAuth() called during SSR - this is not recommended');
      return null;
    }
    
    // In browser, use the full origin for the API URL
    const apiUrl = `${window.location.origin}/api/auth/user`;
      
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include" // Important to include cookies
    });

    if (!response.ok) {
      redirectToLogin();
      return null;
    }

    const data = await response.json();
    
    if (!data.success || !data.user) {
      redirectToLogin();
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error("Auth error:", error);
    redirectToLogin();
    return null;
  }
}
