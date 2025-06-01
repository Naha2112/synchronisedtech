import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/auth";
import { getCurrentUser } from "@/lib/server-auth";
import { useSettingsStore } from "@/lib/settings-store";

/**
 * GET /api/user/profile
 * Returns the current user's profile data including name, email, etc.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }
    
    // Try to get currency from settings store (server-side compatible)
    let currency = 'GBP';
    try {
      // This is a workaround for accessing zustand store on the server
      // In a production app, you would store user settings in the database
      if (typeof localStorage !== 'undefined') {
        const storedSettings = localStorage.getItem('autoflow-settings');
        if (storedSettings) {
          const settings = JSON.parse(storedSettings);
          currency = settings?.state?.defaultCurrency || 'GBP';
        }
      }
    } catch (e) {
      console.log('Unable to access local settings on server');
    }
    
    // For now, just return the user data without sensitive information
    // In a real app, you might have additional profile fields in the database
    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      // Add company details
      company: "Your Company",
      phone: "123-456-7890", // This would ideally come from a company/profile table
      address: "123 Anywhere St., Any City",
      currency: currency // Include currency from settings
    };
    
    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get user profile" },
      { status: 500 }
    );
  }
} 