import { NextRequest, NextResponse } from "next/server"
import { createConnection } from "@/lib/db"
import { getDashboardStats } from "@/app/autoflow/actions/invoices"

export async function GET() {
  const result = await getDashboardStats()
  if (result.success) {
    return NextResponse.json(result)
  } else {
    return NextResponse.json(result, { status: 500 })
  }
} 