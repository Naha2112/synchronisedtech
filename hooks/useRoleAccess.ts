"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User } from "@/lib/auth"

export function useRoleAccess(requiredRoles: string[]) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch("/api/auth/user", {
          credentials: "include",
        })

        if (!response.ok) {
          router.push("/login")
          return
        }

        const data = await response.json()

        if (!data.success || !data.user) {
          router.push("/login")
          return
        }

        setUser(data.user)

        // Check if user has the required role
        const hasRequiredRole = requiredRoles.includes(data.user.role)
        setHasAccess(hasRequiredRole)

        if (!hasRequiredRole) {
          router.push("/unauthorized")
        }
      } catch (error) {
        console.error("Role access error:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [requiredRoles, router])

  return { isLoading, user, hasAccess }
} 