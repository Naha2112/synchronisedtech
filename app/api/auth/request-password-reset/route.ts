import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/server-db";
import { randomBytes } from "crypto";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
  }
  // Find user
  const users = await query("SELECT id FROM users WHERE email = ?", [email]) as any[];
  if (users.length === 0) {
    // Don't reveal if user exists
    return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });
  }
  const userId = users[0].id;
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60).toISOString().slice(0, 19).replace('T', ' '); // 1 hour
  await query("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?", [token, expires, userId]);
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Password Reset Request",
    html: `<p>Click <a href='${resetUrl}'>here</a> to reset your password. This link will expire in 1 hour.</p>`
  });
  return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });
} 