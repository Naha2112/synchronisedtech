import { Resend } from 'resend';

// Initialize the Resend client with proper error handling
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('WARNING: RESEND_API_KEY environment variable is missing!');
}
// Remove any trailing or leading whitespace that might be causing issues
const cleanedApiKey = apiKey ? apiKey.trim() : '';
const resend = new Resend(cleanedApiKey);

// Default sender email - must include a proper name part which is required by Resend
const DEFAULT_FROM = process.env.EMAIL_FROM || 'AutoFlow <onboarding@resend.dev>';

/**
 * Send an email with Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = DEFAULT_FROM,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    // Enhanced debugging for email sending
    console.log('Sending email with details:', { 
      to, 
      subject, 
      from,
      htmlLength: html?.length || 0,
      apiKeyPresent: !!cleanedApiKey,
      apiKeyLength: cleanedApiKey?.length || 0
    });

    if (!cleanedApiKey) {
      console.error('Email sending error: Missing Resend API key. Check your .env.local file.');
      return { success: false, error: 'Resend API key is missing' };
    }

    // Validate inputs before sending
    if (!to || !subject || !html) {
      console.error('Email sending error: Missing required parameters', { to, subject, htmlLength: html?.length || 0 });
      return { success: false, error: 'Missing required email parameters' };
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error from Resend API:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending exception:', error);
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return { success: false, error };
  }
}

/**
 * Send a test email to verify template
 */
export async function sendTestTemplateEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  console.log('Sending test template email to:', to);
  return sendEmail({
    to,
    subject,
    html: body,
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  const subject = 'Verify your email address';
  const html = `
    <h2>Verify your email address</h2>
    <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
    <p><a href="${verifyUrl}">Verify Email</a></p>
    <p>If you did not sign up, you can ignore this email.</p>
  `;
  return sendEmail({ to, subject, html });
} 