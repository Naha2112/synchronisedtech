import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendEmail } from "@/lib/email";

// API secret to protect the endpoint
const API_SECRET = process.env.CRON_API_SECRET || "your-secret-key";

export async function GET(request: Request) {
  try {
    // Get the API key from request headers
    const authHeader = request.headers.get("authorization");
    
    // Basic security check
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1] !== API_SECRET) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get current time in the format matching our database (YYYY-MM-DD HH:MM:SS)
    // Use the system's timezone (same as what we're using in the scheduling function)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // MySQL datetime format: YYYY-MM-DD HH:MM:SS
    const formattedNow = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    console.log(`Current time for comparison: ${formattedNow}`);
    
    // Get scheduled emails that are due
    const scheduledEmails = await query(
      `SELECT * FROM scheduled_emails 
       WHERE status = 'scheduled' 
       AND scheduled_date <= ?`,
      [formattedNow]
    ) as any[];

    console.log(`Processing ${scheduledEmails.length} scheduled emails`);
    
    // Log details about what emails we found (for debugging)
    for (const email of scheduledEmails) {
      console.log(`Found email ID ${email.id} scheduled for ${email.scheduled_date}, recipient: ${email.recipient}`);
    }
    
    let sentCount = 0;
    let failedCount = 0;
    
    // Process each email
    for (const email of scheduledEmails) {
      try {
        // Send the email
        const result = await sendEmail({
          to: email.recipient,
          subject: email.subject,
          html: email.body,
        });
        
        if (result.success) {
          // Update status to sent
          await query(
            `UPDATE scheduled_emails SET status = 'sent', sent_date = NOW() WHERE id = ?`,
            [email.id]
          );
          sentCount++;
          console.log(`Successfully sent scheduled email ID ${email.id} to ${email.recipient}`);
        } else {
          // Update status to failed
          await query(
            `UPDATE scheduled_emails SET status = 'failed' WHERE id = ?`,
            [email.id]
          );
          failedCount++;
          console.error(`Failed to send scheduled email ID ${email.id}:`, result.error);
        }
      } catch (error) {
        // Update status to failed
        await query(
          `UPDATE scheduled_emails SET status = 'failed' WHERE id = ?`,
          [email.id]
        );
        failedCount++;
        console.error(`Error processing scheduled email ${email.id}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      processed: scheduledEmails.length,
      sent: sentCount,
      failed: failedCount,
      currentTime: formattedNow
    });
  } catch (error) {
    console.error("Scheduled emails processing error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process scheduled emails", error: String(error) },
      { status: 500 }
    );
  }
} 