#!/usr/bin/env node

// Script to properly fix the Resend API key in .env.local
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
  console.log('Reading .env.local file...');
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Extract current key
  const match = content.match(/RESEND_API_KEY=(.+?)(\r?\n|$)/);
  if (!match) {
    console.error('ERROR: RESEND_API_KEY not found in .env.local!');
    process.exit(1);
  }
  
  const currentKey = match[1];
  console.log(`Current key found (${currentKey.length} characters)`);
  
  // Remove spaces, % characters, and trim
  const cleanedKey = currentKey.replace(/\s+/g, '').replace(/%/g, '').trim();
  console.log(`Cleaned key (${cleanedKey.length} characters)`);
  
  // Validate the key format
  if (!cleanedKey.startsWith('re_')) {
    console.error('WARNING: The cleaned API key does not start with "re_". This might not be a valid Resend API key.');
  }
  
  // Replace the key in the content
  const newContent = content.replace(/RESEND_API_KEY=.+?(\r?\n|$)/, `RESEND_API_KEY=${cleanedKey}$1`);
  
  // Write back to file
  fs.writeFileSync(envPath, newContent);
  
  console.log('Successfully fixed RESEND_API_KEY in .env.local!');
} catch (error) {
  console.error('Error fixing Resend API key:', error);
  process.exit(1);
} 