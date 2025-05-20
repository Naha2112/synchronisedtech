import { Resend } from 'resend';

// Initialize the Resend client with a safer check for the API key
const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey !== undefined ? apiKey : 're_bePxwZfg_MidWFBQacDjc5Y3Hwi5fcfQx');

// Default sender email
const DEFAULT_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';

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
    // Log the API key being used for debugging (don't do this in production)
    console.log('Using API key:', apiKey ? 'Found in env' : 'Using fallback');

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending exception:', error);
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
  return sendEmail({
    to,
    subject,
    html: body,
  });
} 