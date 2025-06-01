import { NextRequest, NextResponse } from 'next/server';
import { createEmailTemplate } from '@/app/autoflow/actions/email-templates';
import { getCurrentUser } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication using the app's existing auth system
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request
    const requestData = await request.json();
    const { content, type, description } = requestData;

    // Validate input
    if (!content || !type) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: content and type' },
        { status: 400 }
      );
    }

    // Extract subject and body from content
    let subject = '';
    let emailBody = content;

    // Extract subject line from the template content
    // Example format: "Subject: This is the subject"
    const subjectMatch = content.match(/^Subject:(.+?)(?:\n|\r\n)/i);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
      // Remove the subject line from the body
      emailBody = content.substring(content.indexOf('\n') + 1).trim();
    } else {
      // If no subject found, use the template type as the subject
      subject = `${type.charAt(0).toUpperCase() + type.slice(1)} Template`;
    }

    // Create a name for the template
    const name = `AI Generated - ${type.charAt(0).toUpperCase() + type.slice(1)}${description ? ` - ${description.slice(0, 30)}` : ''}`;

    // Save the template to the database using the server action
    const result = await createEmailTemplate({
      name,
      subject,
      body: emailBody,
      type,
      status: 'draft'
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to save template' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template saved successfully',
      templateId: result.templateId
    });
  } catch (error) {
    console.error('Save template error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to save template' },
      { status: 500 }
    );
  }
} 