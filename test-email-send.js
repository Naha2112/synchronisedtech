#!/usr/bin/env node

// Test script to verify email sending functionality
const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testEmailSending() {
  console.log('🧪 Testing Email Sending Functionality');
  console.log('=====================================');

  // Check environment variables
  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  console.log('Environment Check:');
  console.log('✓ RESEND_API_KEY:', apiKey ? `Found (${apiKey.length} chars)` : 'Missing');
  console.log('✓ EMAIL_FROM:', emailFrom || 'Missing');
  console.log('✓ API Key Format:', apiKey && apiKey.startsWith('re_') ? 'Valid' : 'Invalid');
  console.log('');

  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is missing!');
    process.exit(1);
  }

  if (!emailFrom) {
    console.error('❌ EMAIL_FROM is missing!');
    process.exit(1);
  }

  // Initialize Resend
  const resend = new Resend(apiKey.trim());
  
  console.log('📧 Testing Email Send to Test Address...');
  
  try {
    const result = await resend.emails.send({
      from: emailFrom,
      to: 'delivered@resend.dev', // Use Resend's official testing email
      subject: 'AutoFlow Email Test - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🚀 AutoFlow Email Test</h2>
          <p>This is a test email from the AutoFlow system.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>Configuration:</strong></p>
          <ul>
            <li>API Key Length: ${apiKey.length} characters</li>
            <li>From Email: ${emailFrom}</li>
            <li>Environment: ${process.env.NODE_ENV || 'development'}</li>
          </ul>
          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated test email from AutoFlow email functionality testing.
          </p>
        </div>
      `,
    });

    if (result.error) {
      console.error('❌ Email sending failed:');
      console.error('Error details:', JSON.stringify(result.error, null, 2));
      
      // Check for common error types
      if (result.error.message && result.error.message.includes('API key')) {
        console.log('\n💡 Troubleshooting: API Key issue detected');
        console.log('   - Verify your RESEND_API_KEY in .env.local');
        console.log('   - Make sure it starts with "re_"');
        console.log('   - Check for extra spaces or characters');
      }
      
      if (result.error.message && result.error.message.includes('domain')) {
        console.log('\n💡 Troubleshooting: Domain issue detected');
        console.log('   - Verify your domain is added to Resend');
        console.log('   - Check EMAIL_FROM format: "Name <email@yourdomain.com>"');
      }
      
      process.exit(1);
    } else {
      console.log('✅ Email API call successful!');
      console.log('📧 Email ID:', result.data?.id || 'No ID returned');
      console.log('');
      console.log('🎉 Email sending functionality is working correctly!');
      console.log('');
      console.log('Note: test@example.com is a test domain, so no actual email was sent.');
      console.log('To test with a real email, replace the "to" address with your email.');
    }
  } catch (error) {
    console.error('❌ Email sending exception:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run the test
testEmailSending().catch(console.error); 