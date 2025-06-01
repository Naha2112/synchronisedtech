import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/server-db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  const { token, password } = await request.json();
  if (!token || !password) {
    return NextResponse.json({ success: false, message: "Token and new password are required" }, { status: 400 });
  }
  // Find user by token and check expiry
  const users = await query("SELECT id, reset_token_expires FROM users WHERE reset_token = ?", [token]) as any[];
  if (users.length === 0) {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
  }
  const user = users[0];
  if (!user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
    return NextResponse.json({ success: false, message: "Token has expired" }, { status: 400 });
  }
  // Update password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await query("UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?", [hashedPassword, user.id]);
  return NextResponse.json({ success: true, message: "Password has been reset. You can now log in." });
} 