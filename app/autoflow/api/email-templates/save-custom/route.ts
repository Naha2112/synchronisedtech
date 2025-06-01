import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Authenticate user
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get request data
    const data = await request.json();
    const { name, subject, content } = data;

    // Validate input
    if (!name || !subject || !content) {
      return NextResponse.json(
        { success: false, message: 'Name, subject, and content are required' },
        { status: 400 }
      );
    }

    // Insert template into database
    const result = await query(
      `INSERT INTO email_templates (name, subject, body, created_by, updated_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, subject, content, user.id]
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Failed to save template' },
        { status: 500 }
      );
    }

    const insertId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      message: 'Template saved successfully',
      templateId: insertId,
    });
  } catch (error: any) {
    console.error('Save template error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to save template',
        error: error?.message
      },
      { status: 500 }
    );
  }
} 