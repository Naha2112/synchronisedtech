import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Authentication and role checks are disabled
  return NextResponse.next();
}
