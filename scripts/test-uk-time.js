#!/usr/bin/env node

/**
 * Test script for UK time handling in scheduled emails
 * This script:
 * 1. Creates a test scheduled email for 1 minute in the future
 * 2. Waits 1 minute
 * 3. Runs the cron job to check if it processes the email
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const https = require('https');
const { execSync } = require('child_process');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CRON_API_SECRET = process.env.CRON_API_SECRET;
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

if (!CRON_API_SECRET) {
  console.error('CRON_API_SECRET is not defined in your environment variables.');
  process.exit(1);
}

async function testUKTimeScheduling() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "password",
      database: "autoflow"
    });
    
    console.log('Connected to database');
    
    // Get current time info
    const now = new Date();
    const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzOffset = now.getTimezoneOffset();
    const tzOffsetHours = Math.abs(Math.floor(tzOffset / 60));
    const tzOffsetMins = Math.abs(tzOffset % 60);
    const tzFormatted = `${tzOffset <= 0 ? '+' : '-'}${tzOffsetHours.toString().padStart(2, '0')}:${tzOffsetMins.toString().padStart(2, '0')}`;
    
    console.log(`Current time: ${now.toLocaleString()} (${timezoneName}, UTC${tzFormatted})`);
    
    // Create a date 1 minute in the future
    const futureDate = new Date(now.getTime() + 60000); // 60000ms = 1 minute
    
    // Format the date for MySQL
    const year = futureDate.getFullYear();
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    const hours = String(futureDate.getHours()).padStart(2, '0');
    const minutes = String(futureDate.getMinutes()).padStart(2, '0');
    const seconds = String(futureDate.getSeconds()).padStart(2, '0');
    
    // MySQL datetime format: YYYY-MM-DD HH:MM:SS
    const mysqlDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    console.log(`Scheduling test email for: ${futureDate.toLocaleString()} (${timezoneName})`);
    console.log(`MySQL formatted date: ${mysqlDateString}`);
    
    // Find the first available template to use
    const [templates] = await connection.execute(
      "SELECT id FROM email_templates LIMIT 1"
    );
    
    if (templates.length === 0) {
      console.error("No email templates found. Please create a template first.");
      return { success: false };
    }
    
    const templateId = templates[0].id;
    
    // Create a test scheduled email directly in the database
    await connection.execute(
      `INSERT INTO scheduled_emails 
       (email_template_id, recipient, subject, body, scheduled_date, created_by, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        templateId,
        "test@example.com",
        "UK Time Test Email",
        "<p>This is a test email for UK time handling.</p>",
        mysqlDateString,
        1, // User ID 1
        "scheduled"
      ]
    );
    
    console.log("Test email scheduled successfully");
    console.log("Waiting 70 seconds to let the scheduled time pass...");
    
    // Wait 70 seconds (1 minute + 10 seconds buffer)
    await new Promise(resolve => setTimeout(resolve, 70000));
    
    console.log("\nTime's up! Current time:", new Date().toLocaleString());
    console.log("Running cron job to process the scheduled email...");
    
    // Run the cron job
    return new Promise((resolve, reject) => {
      const urlObj = new URL('/api/cron/scheduled-emails', BASE_URL);
      
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${CRON_API_SECRET}`
        }
      };
      
      const requester = urlObj.protocol === 'https:' ? https : http;
      
      const req = requester.request(urlObj, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log('Cron job response:', response);
            
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve({ success: true, ...response });
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
  } catch (error) {
    console.error("Error testing UK time scheduling:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the test
console.log("=== UK Time Scheduling Test ===");
testUKTimeScheduling()
  .then(result => {
    console.log("\nTest completed with result:", result);
    
    // Check the database for the final status
    setTimeout(() => {
      try {
        console.log("\nChecking final status in database:");
        const result = execSync('mysql -h localhost -u root -ppassword -e "USE autoflow; SELECT id, recipient, subject, status, scheduled_date, sent_date FROM scheduled_emails WHERE subject = \'UK Time Test Email\' ORDER BY id DESC LIMIT 1;"');
        console.log(result.toString());
      } catch (error) {
        console.error("Could not check database status:", error.message);
      }
      process.exit(0);
    }, 1000);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 