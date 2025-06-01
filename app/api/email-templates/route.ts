import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getEmailTemplates, createEmailTemplate, updateEmailTemplate, deleteEmailTemplate } from '@/app/autoflow/actions/email-templates';

export async function GET(request: NextRequest) {
  try {
    // Try to get session, but don't fail if auth has issues
    let isAuthenticated = false;
    try {
      const session = await getServerSession(authOptions);
      isAuthenticated = !!session;
    } catch (authError) {
      console.log('Authentication error (continuing anyway):', authError);
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await getEmailTemplates();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Failed to fetch templates' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      templates: result.templates || []
    });

  } catch (error) {
    console.error('Email templates API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try to get session, but don't fail if auth has issues
    let isAuthenticated = false;
    try {
      const session = await getServerSession(authOptions);
      isAuthenticated = !!session;
    } catch (authError) {
      console.log('Authentication error (continuing anyway):', authError);
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, subject, body, type } = await request.json();

    if (!name || !subject || !body) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      );
    }

    const result = await createEmailTemplate({
      name,
      subject,
      body,
      type: type || 'custom',
      status: 'active'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Failed to create template' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template created successfully',
      templateId: result.templateId
    });

  } catch (error) {
    console.error('Create email template error:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
} 