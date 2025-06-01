#!/usr/bin/env node

// Test script to send an email using Resend API directly
require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.error('ERROR: RESEND_API_KEY is missing in .env.local!');
  process.exit(1);
}

// Clean the API key
const cleanedApiKey = apiKey.trim();
console.log(`API Key: ${cleanedApiKey ? `Found (${cleanedApiKey.length} characters)` : 'Missing'}`);

// Initialize Resend with the cleaned API key
const resend = new Resend(cleanedApiKey);

async function main() {
  try {
    // Get email recipient from command line arguments
    const recipient = process.argv[2];
    if (!recipient) {
      console.error('Please provide a recipient email address as an argument:');
      console.error('  node test-email.js recipient@example.com');
      process.exit(1);
    }

    console.log(`Sending test email to: ${recipient}`);
    
    // Send the email
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'AutoFlow <onboarding@resend.dev>',
      to: recipient,
      subject: 'Test Email from AutoFlow',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test Email from AutoFlow</h2>
          <p>This is a test email sent directly with Resend API.</p>
          <p>If you're seeing this, your email configuration is working!</p>
          <p>Current time: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      process.exit(1);
    }

    console.log('Email sent successfully!');
    console.log('Data:', data);
  } catch (error) {
    console.error('Error sending email:', error);
    process.exit(1);
  }
}

main(); 