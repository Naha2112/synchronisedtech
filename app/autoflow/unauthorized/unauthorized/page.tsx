"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => router.back()}>Go Back</Button>
          <Button variant="outline" asChild>
            <Link href="/autoflow/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 