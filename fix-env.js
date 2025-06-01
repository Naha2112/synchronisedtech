// Script to fix the .env.local file
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
  console.log('Reading .env.local file...');
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Fix the Resend API key by removing the '%' character
  content = content.replace(/RESEND_API_KEY=(.+?)%/, 'RESEND_API_KEY=$1');
  
  // Write the fixed content back to the file
  fs.writeFileSync(envPath, content);
  console.log('Successfully fixed .env.local file! The Resend API key has been corrected.');
} catch (error) {
  console.error('Error fixing .env.local file:', error);
} 