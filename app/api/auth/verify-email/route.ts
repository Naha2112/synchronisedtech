import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/server-db";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ success: false, message: "Missing token" }, { status: 400 });
  }
  // Find user by token
  const users = await query("SELECT id FROM users WHERE verification_token = ?", [token]) as any[];
  if (users.length === 0) {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
  }
  const userId = users[0].id;
  // Set verified and clear token
  await query("UPDATE users SET verified = 1, verification_token = NULL WHERE id = ?", [userId]);
  return NextResponse.json({ success: true, message: "Email verified successfully. You can now log in." });
} 