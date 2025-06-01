import { NextResponse } from 'next/server';

// A simple in-memory store for email sending progress
// In a production app, this should be replaced with Redis or a similar solution
let emailSendingProgress = {
  sent: 0,
  total: 0,
  errors: [] as string[],
  completed: false,
  lastUpdated: new Date(),
};

// Reset progress after 10 minutes of inactivity
setInterval(() => {
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  
  if (emailSendingProgress.lastUpdated < tenMinutesAgo) {
    resetProgress();
  }
}, 60 * 1000);

export function resetProgress() {
  emailSendingProgress = {
    sent: 0,
    total: 0,
    errors: [],
    completed: false,
    lastUpdated: new Date(),
  };
}

export function updateProgress(sent: number, total: number, completed = false, error?: string) {
  emailSendingProgress.sent = sent;
  emailSendingProgress.total = total;
  emailSendingProgress.completed = completed;
  emailSendingProgress.lastUpdated = new Date();
  
  if (error) {
    emailSendingProgress.errors.push(error);
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      ...emailSendingProgress
    });
  } catch (error) {
    console.error('Bulk email status error:', error);
    return NextResponse.json(
      { error: 'Failed to get bulk email status' },
      { status: 500 }
    );
  }
} 