import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createEmailTemplate } from '@/app/autoflow/actions/email-templates';

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

    const { name, subject, body } = await request.json();

    if (!name || !subject || !body) {
      return NextResponse.json(
        { error: 'Name, subject, and body are required' },
        { status: 400 }
      );
    }

    // Save the custom template
    const result = await createEmailTemplate({
      name,
      subject,
      body,
      type: 'custom',
      status: 'active'
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Failed to save template' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template saved successfully',
      templateId: result.templateId
    });

  } catch (error) {
    console.error('Save custom template error:', error);
    return NextResponse.json(
      { error: 'Failed to save custom template' },
      { status: 500 }
    );
  }
} 