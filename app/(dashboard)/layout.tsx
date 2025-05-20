import type { ReactNode } from "react"
import { DashboardLayoutClient } from "./DashboardClient"
import { WorkflowAlerts } from './components/workflow-alerts'
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { getUserById } from "@/lib/server-db"
import { CurrencyProvider } from "@/components/currency-provider"

// This layout relies on middleware for authentication
export default async function Layout({ children }: { children: ReactNode }) {
  // Get the user from the token
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  let user = { name: "User" }
  
  if (token) {
    try {
      const payload = await verifyToken(token)
      if (payload && payload.id) {
        const userData = await getUserById(Number(payload.id))
        if (userData) {
          user = userData
        }
      }
    } catch (error) {
      console.error("Error getting user:", error)
    }
  }
  
  return (
    <DashboardLayoutClient user={user}>
      <CurrencyProvider>
        <div className="container py-6">
          <WorkflowAlerts />
          {children}
        </div>
      </CurrencyProvider>
    </DashboardLayoutClient>
  );
} 