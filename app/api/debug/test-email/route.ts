import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server-auth";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Get request data
    const data = await request.json();
    const { to } = data;

    if (!to) {
      return NextResponse.json(
        { success: false, message: "Recipient email is required" },
        { status: 400 }
      );
    }

    // Send a test email
    const emailResult = await sendEmail({
      to,
      subject: "AutoFlow Test Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email from AutoFlow</h2>
          <p>This is a test email sent from AutoFlow.</p>
          <p>If you're receiving this, your email configuration is working correctly!</p>
          <p>Current time: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error("Test email failed:", emailResult.error);
      
      let errorMessage = "Failed to send test email";
      if (emailResult.error) {
        if (typeof emailResult.error === 'string') {
          errorMessage += ": " + emailResult.error;
        } else if (typeof emailResult.error === 'object') {
          try {
            errorMessage += ": " + JSON.stringify(emailResult.error);
          } catch (e) {
            errorMessage += ": Unknown error details";
          }
        }
      }
      
      return NextResponse.json(
        { success: false, message: errorMessage, error: emailResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to send test email", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 