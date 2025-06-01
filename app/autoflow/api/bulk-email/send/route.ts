import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { parse } from 'csv-parse/sync';
import { resetProgress, updateProgress } from '../status/route';

// Initialize Resend with better error handling
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('WARNING: RESEND_API_KEY environment variable is missing in bulk email sender!');
}
const resend = new Resend(apiKey);

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read and parse CSV file
    const fileContent = await file.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Reset progress tracking
    resetProgress();
    
    // If in test mode, limit to first 3 recipients
    const recipientsToProcess = testMode ? records.slice(0, 3) : records;
    
    // Update initial progress state
    updateProgress(0, recipientsToProcess.length);

    let sentCount = 0;
    const errors: string[] = [];

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
        
        const personalizedTemplate = template.replace(/{name}/g, record.name || '');
        
        console.log(`Attempting to send email to: ${record.email}`);
        
        const result = await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
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
          console.log(`Successfully sent email to ${record.email}`);
        }
        
        // Add delay between sends if specified
        if (delayMs > 0 && index < recipientsToProcess.length - 1) {
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

    return NextResponse.json({
      success: true,
      sentCount,
      total: recipientsToProcess.length,
      testMode,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Bulk email error:', error);
    return NextResponse.json(
      { error: 'Failed to process bulk email request', details: error?.message },
      { status: 500 }
    );
  }
} 