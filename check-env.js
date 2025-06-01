#!/usr/bin/env node

// Script to check the environment variables for common issues
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('AutoFlow Environment Checker');
console.log('---------------------------');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.error('ERROR: .env.local file does not exist!');
  console.log('Please create a .env.local file with the following variables:');
  console.log(`
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=AutoFlow <onboarding@yourdomain.com>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
`);
  process.exit(1);
}

// Read .env.local file
try {
  console.log('Reading .env.local file...');
  const content = fs.readFileSync(envPath, 'utf8');
  
  // Check for Resend API key
  const resendApiKeyMatch = content.match(/RESEND_API_KEY=(.+?)(\r?\n|$)/);
  if (!resendApiKeyMatch) {
    console.error('ERROR: RESEND_API_KEY is missing in .env.local!');
  } else {
    const apiKey = resendApiKeyMatch[1].trim();
    console.log(`RESEND_API_KEY: ${apiKey ? `Found (${apiKey.length} characters)` : 'Empty'}`);
    
    // Check for common issues
    if (apiKey.includes('%')) {
      console.error('ERROR: RESEND_API_KEY contains a % character which might cause issues.');
      console.log('Running fix-env.js to fix this issue...');
      require('./fix-env.js');
    }
    
    if (apiKey.includes(' ')) {
      console.error('WARNING: RESEND_API_KEY contains spaces which might cause issues.');
    }
    
    if (!apiKey.startsWith('re_')) {
      console.error('WARNING: RESEND_API_KEY does not start with "re_". Make sure you are using a valid Resend API key.');
    }
  }
  
  // Check for EMAIL_FROM
  const emailFromMatch = content.match(/EMAIL_FROM=(.+?)(\r?\n|$)/);
  if (!emailFromMatch) {
    console.error('WARNING: EMAIL_FROM is missing in .env.local!');
  } else {
    const emailFrom = emailFromMatch[1].trim();
    console.log(`EMAIL_FROM: ${emailFrom || 'Empty'}`);
    
    if (!emailFrom.includes('<') || !emailFrom.includes('>')) {
      console.error('WARNING: EMAIL_FROM should be in the format "Name <email@example.com>"');
    }
  }
  
  // Check for NEXT_PUBLIC_BASE_URL
  const baseUrlMatch = content.match(/NEXT_PUBLIC_BASE_URL=(.+?)(\r?\n|$)/);
  if (!baseUrlMatch) {
    console.error('WARNING: NEXT_PUBLIC_BASE_URL is missing in .env.local!');
  } else {
    const baseUrl = baseUrlMatch[1].trim();
    console.log(`NEXT_PUBLIC_BASE_URL: ${baseUrl || 'Empty'}`);
  }
  
  console.log('\nEnvironment check completed.');
} catch (error) {
  console.error('Error checking .env.local file:', error);
  process.exit(1);
} 