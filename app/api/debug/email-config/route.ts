import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/server-auth";

export async function GET() {
  try {
    // Check authentication
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    // Check email configuration
    const apiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM;

    // Prepare the response
    const diagnostics = {
      apiKeyExists: !!apiKey,
      apiKeyLength: apiKey ? apiKey.length : 0,
      apiKeyFirstChars: apiKey ? `${apiKey.substring(0, 3)}...` : null,
      apiKeyLastChars: apiKey ? `...${apiKey.substring(apiKey.length - 3)}` : null,
      emailFrom,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json({
      success: true,
      diagnostics,
    });
  } catch (error) {
    console.error("Email config debug error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to fetch email configuration", 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 