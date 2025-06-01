"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/auth'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    async function checkUserRole() {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include',
        })

        if (!response.ok) {
          router.push('/login')
          return
        }

        const data = await response.json()
        if (!data.success || !data.user) {
          router.push('/login')
          return
        }

        const user: User = data.user
        const hasRole = allowedRoles.includes(user.role)
        setHasPermission(hasRole)
        setLoading(false)
      } catch (error) {
        console.error('Role guard error:', error)
        setLoading(false)
      }
    }

    checkUserRole()
  }, [allowedRoles, router])

  if (loading) {
    return null // Or return a loading spinner
  }

  if (!hasPermission) {
    return fallback
  }

  return <>{children}</>
} 