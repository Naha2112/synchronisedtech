import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server-auth";

/**
 * GET /api/user/settings
 * Returns the current user's settings including currency preferences
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }
    
    // Get currency from query params or default to GBP
    // In a real app, you would store user settings in the database
    // For now, we'll check if the client sent currency info
    const currency = request.nextUrl.searchParams.get('currency') || 'GBP';
    
    const settings = {
      userId: user.id,
      defaultCurrency: currency,
      defaultPaymentTerms: 30,
      // Other settings...
    };
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error getting user settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get user settings" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/settings
 * Updates the current user's settings
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { currency, paymentTerms } = body;
    
    // In a real app, you would save this to a database
    // For now, we'll just acknowledge the update
    console.log(`User ${user.id} updated settings: currency=${currency}, paymentTerms=${paymentTerms}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Settings updated successfully" 
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user settings" },
      { status: 500 }
    );
  }
} 