#!/usr/bin/env node

const http = require('http');
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
const url = require('url');

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
  
  console.log(`Running scheduled emails cron job at ${now.toISOString()}`);
  console.log(`Local time: ${now.toLocaleString()} (${timezoneName}, UTC${tzFormatted})`);
  console.log(`URL: ${urlObj.toString()}`);
  
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
          console.log('Response:', response);
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

// Run the job
runCronJob()
  .then(result => {
    console.log('Cron job completed successfully:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Cron job failed:', error);
    process.exit(1);
  }); 