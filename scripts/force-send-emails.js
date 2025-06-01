#!/usr/bin/env node

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const https = require('https');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CRON_API_SECRET = process.env.CRON_API_SECRET;
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

if (!CRON_API_SECRET) {
  console.error('CRON_API_SECRET is not defined in your environment variables.');
  process.exit(1);
}

async function forceSendScheduledEmails() {
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
    
    // Get current server time
    const [serverTimeResult] = await connection.execute('SELECT NOW() as server_time');
    const serverTime = serverTimeResult[0].server_time;
    console.log(`Current server time: ${serverTime}`);
    
    // Find all emails with 'scheduled' status
    const [scheduledEmails] = await connection.execute(
      `SELECT id, recipient, subject, scheduled_date 
       FROM scheduled_emails 
       WHERE status = 'scheduled'`
    );
    
    console.log(`Found ${scheduledEmails.length} scheduled emails to process`);
    
    if (scheduledEmails.length === 0) {
      console.log('No scheduled emails to process');
      return { success: true, processed: 0 };
    }
    
    // Force the scheduled_date to be in the past for all scheduled emails
    const updatePromises = scheduledEmails.map(email => {
      const pastDate = new Date(serverTime);
      pastDate.setMinutes(pastDate.getMinutes() - 5); // 5 minutes in the past
      
      const formattedDate = pastDate.toISOString().slice(0, 19).replace('T', ' ');
      
      console.log(`Setting email ID ${email.id} scheduled date to ${formattedDate} (was ${email.scheduled_date})`);
      
      return connection.execute(
        `UPDATE scheduled_emails SET scheduled_date = ? WHERE id = ?`,
        [formattedDate, email.id]
      );
    });
    
    await Promise.all(updatePromises);
    console.log('All scheduled dates updated');
    
    // Now call the cron API to process the emails
    return new Promise((resolve, reject) => {
      const urlObj = new URL('/api/cron/scheduled-emails', BASE_URL);
      
      console.log(`Calling cron API at ${urlObj.toString()}`);
      
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
            console.log('API Response:', response);
            
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
    console.error("Error processing scheduled emails:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the function
forceSendScheduledEmails()
  .then(result => {
    console.log('Operation completed:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Operation failed:', error);
    process.exit(1);
  }); 