"use client"

import { useState, useEffect } from "react"
import { useRoleAccess } from "@/hooks/useRoleAccess"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"

type User = {
  id: number
  name: string
  email: string
  role: string
}

export default function UsersPage() {
  const { isLoading, hasAccess } = useRoleAccess(["admin"])
  const [users, setUsers] = useState<User[]>([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    if (hasAccess) {
      fetchUsers()
    }
  }, [hasAccess])

  const fetchUsers = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch("/api/users/role", {
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      } else {
        throw new Error(data.message || "Failed to fetch users")
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "An error occurred",
        type: "error"
      })
    } finally {
      setFetchLoading(false)
    }
  }

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const response = await fetch("/api/users/role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, newRole }),
        credentials: "include"
      })

      const data = await response.json()

      if (data.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
        setMessage({ text: "User role updated successfully", type: "success" })
      } else {
        throw new Error(data.message || "Failed to update user role")
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : "An error occurred",
        type: "error"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return null // Will redirect to unauthorized page via the hook
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      {message && (
        <Alert className={`mb-6 ${message.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
          <AlertTitle>{message.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {fetchLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Select 
                    defaultValue={user.role}
                    onValueChange={(value) => updateUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
} 