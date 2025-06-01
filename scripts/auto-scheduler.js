#!/usr/bin/env node

/**
 * Auto Scheduler for AutoFlow
 * 
 * This script runs in the background and checks for scheduled emails every minute.
 * It doesn't rely on cron or any external scheduling mechanism.
 */

const http = require('http');
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
const url = require('url');
const { exec } = require('child_process');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CRON_API_SECRET = process.env.CRON_API_SECRET;
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

if (!CRON_API_SECRET) {
  console.error('CRON_API_SECRET is not defined in your environment variables.');
  process.exit(1);
}

// Function to run the cron job
async function runCronJob() {
  const urlObj = new URL('/api/cron/scheduled-emails', BASE_URL);
  
  // Show the local time and timezone information
  const now = new Date();
  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzOffset = now.getTimezoneOffset();
  const tzOffsetHours = Math.abs(Math.floor(tzOffset / 60));
  const tzOffsetMins = Math.abs(tzOffset % 60);
  const tzFormatted = `${tzOffset <= 0 ? '+' : '-'}${tzOffsetHours.toString().padStart(2, '0')}:${tzOffsetMins.toString().padStart(2, '0')}`;
  
  console.log(`\n[${now.toLocaleString()}] Checking for scheduled emails...`);
  console.log(`Local time: ${now.toLocaleString()} (${timezoneName}, UTC${tzFormatted})`);
  
  // Make the HTTP request
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CRON_API_SECRET}`
    }
  };
  
  return new Promise((resolve, reject) => {
    // Use http or https module based on the protocol
    const requester = urlObj.protocol === 'https:' ? https : http;
    
    const req = requester.request(urlObj, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.processed > 0) {
            console.log(`Successfully processed ${response.sent} emails (${response.processed} total)`);
          } else {
            console.log('No emails due for sending at this time');
          }
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`HTTP Error: ${res.statusCode} ${res.statusMessage}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Error:', error);
      reject(error);
    });
    
    req.end();
  });
}

// Function to ensure the Next.js server is running
function ensureServerRunning() {
  return new Promise((resolve, reject) => {
    // Simple ping to check if server is up
    const urlObj = new URL('/', BASE_URL);
    const requester = urlObj.protocol === 'https:' ? https : http;
    
    const req = requester.request(urlObj, { method: 'HEAD' }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 500) {
        console.log('Server is running');
        resolve(true);
      } else {
        console.log(`Server returned status code ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', () => {
      console.log('Server is not running');
      resolve(false);
    });
    
    req.end();
  });
}

// Main function that runs indefinitely
async function main() {
  console.log('AutoFlow Auto Scheduler starting...');
  console.log(`Server URL: ${BASE_URL}`);
  console.log('This script will check for scheduled emails every minute.');
  console.log('Press Ctrl+C to stop.\n');
  
  // Endless loop
  while (true) {
    try {
      // First check if the server is running
      const isServerRunning = await ensureServerRunning();
      
      if (isServerRunning) {
        // Run the cron job
        await runCronJob();
      } else {
        console.log('Skipping check because server is not running');
      }
      
      // Wait for 1 minute before next check
      console.log(`Next check at: ${new Date(Date.now() + 60000).toLocaleString()}`);
      await new Promise(resolve => setTimeout(resolve, 60000));
    } catch (error) {
      console.error('Error in main loop:', error);
      // Still wait before retry
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }
}

// Start the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 