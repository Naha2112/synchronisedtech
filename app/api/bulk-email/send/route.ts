import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { parse } from 'csv-parse/sync';

// Initialize Resend with better error handling
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('WARNING: RESEND_API_KEY environment variable is missing in bulk email sender!');
}
const resend = new Resend(apiKey);

// Store progress in memory (in production, use Redis or similar)
let emailProgress = {
  sent: 0,
  total: 0,
  errors: [] as string[],
  completed: false,
  lastUpdated: new Date(),
};

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function resetProgress() {
  emailProgress = {
    sent: 0,
    total: 0,
    errors: [],
    completed: false,
    lastUpdated: new Date(),
  };
}

export function updateProgress(sent: number, total: number, completed = false, error?: string) {
  emailProgress.sent = sent;
  emailProgress.total = total;
  emailProgress.completed = completed;
  emailProgress.lastUpdated = new Date();
  
  if (error) {
    emailProgress.errors.push(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for API key first
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Resend API key is missing. Please add RESEND_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const template = formData.get('template') as string;
    const subject = formData.get('subject') as string;
    const delayMs = parseInt(formData.get('delay') as string || '0', 10);
    const testMode = (formData.get('testMode') as string) === 'true';

    if (!file || !template || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: file, template, and subject are required' },
        { status: 400 }
      );
    }

    // Read and parse CSV file
    const fileContent = await file.text();
    let records;
    
    try {
      records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });
    } catch (parseError) {
      console.error('CSV parsing error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse CSV file. Please check the format.' },
        { status: 400 }
      );
    }

    // Reset progress tracking
    resetProgress();
    
    // If in test mode, limit to first 3 recipients
    const recipientsToProcess = testMode ? records.slice(0, 3) : records;
    
    // Update initial progress state
    updateProgress(0, recipientsToProcess.length);

    let sentCount = 0;
    const errors: string[] = [];

    console.log(`Starting bulk email send: ${recipientsToProcess.length} recipients (test mode: ${testMode})`);

    // Process each record and send email
    for (const [index, record] of recipientsToProcess.entries()) {
      try {
        // Skip records with missing email
        if (!record.email) {
          const errorMsg = `Skipped record ${index + 1}: Missing email address`;
          errors.push(errorMsg);
          updateProgress(sentCount, recipientsToProcess.length, false, errorMsg);
          continue;
        }
        
        // Personalize the template
        const personalizedTemplate = template.replace(/{name}/g, record.name || 'Valued Customer');
        
        console.log(`Attempting to send email ${index + 1}/${recipientsToProcess.length} to: ${record.email}`);
        
        const result = await resend.emails.send({
          from: process.env.EMAIL_FROM || 'AutoFlow <onboarding@resend.dev>',
          to: record.email,
          subject: subject,
          html: personalizedTemplate,
        });
        
        if (result.error) {
          const errorMessage = `Failed to send to ${record.email}: ${result.error.message || JSON.stringify(result.error)}`;
          errors.push(errorMessage);
          updateProgress(sentCount, recipientsToProcess.length, false, errorMessage);
          console.error(`Email sending error to ${record.email}:`, result.error);
        } else {
          sentCount++;
          updateProgress(sentCount, recipientsToProcess.length);
          console.log(`Successfully sent email to ${record.email} (${sentCount}/${recipientsToProcess.length})`);
        }
        
        // Add delay between sends if specified
        if (delayMs > 0 && index < recipientsToProcess.length - 1) {
          console.log(`Waiting ${delayMs}ms before next email...`);
          await delay(delayMs);
        }
      } catch (error: any) {
        const errorMessage = `Failed to send to ${record.email}: ${error?.message || 'Unknown error'}`;
        console.error(`Exception sending to ${record.email}:`, error);
        errors.push(errorMessage);
        updateProgress(sentCount, recipientsToProcess.length, false, errorMessage);
      }
    }

    // Mark progress as completed
    updateProgress(sentCount, recipientsToProcess.length, true);

    const resultMessage = testMode 
      ? `Test mode: ${sentCount} of ${recipientsToProcess.length} emails sent successfully`
      : `${sentCount} of ${recipientsToProcess.length} emails sent successfully`;

    console.log(`Bulk email completed: ${resultMessage}`);

    return NextResponse.json({
      success: true,
      sentCount,
      total: recipientsToProcess.length,
      testMode,
      errors: errors.length > 0 ? errors : undefined,
      message: resultMessage
    });
    
  } catch (error: any) {
    console.error('Bulk email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process bulk email request', 
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 