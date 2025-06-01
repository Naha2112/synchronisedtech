#!/usr/bin/env node

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function debugScheduler() {
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
    
    // Get all scheduled emails
    const [scheduledEmails] = await connection.execute(
      `SELECT id, email_template_id, recipient, subject, status, scheduled_date, sent_date, created_by 
       FROM scheduled_emails 
       ORDER BY scheduled_date DESC`
    );
    
    console.log('\nScheduled Emails:');
    console.log('=====================================');
    
    if (scheduledEmails.length === 0) {
      console.log('No scheduled emails found');
    } else {
      scheduledEmails.forEach(email => {
        console.log(`ID: ${email.id}`);
        console.log(`Template ID: ${email.email_template_id}`);
        console.log(`Recipient: ${email.recipient}`);
        console.log(`Subject: ${email.subject}`);
        console.log(`Status: ${email.status}`);
        console.log(`Scheduled Date: ${email.scheduled_date}`);
        console.log(`Sent Date: ${email.sent_date || 'Not sent yet'}`);
        console.log(`Created By: ${email.created_by}`);
        
        // Check if the email should be sent by now
        const scheduledDate = new Date(email.scheduled_date);
        const currentDate = new Date(serverTime);
        
        if (scheduledDate <= currentDate && email.status === 'scheduled') {
          console.log('*** This email should have been sent by now! ***');
        }
        
        console.log('-------------------------------------');
      });
    }
    
    // Check the cron API secret
    console.log(`\nCRON_API_SECRET: ${process.env.CRON_API_SECRET ? 'Set (length: ' + process.env.CRON_API_SECRET.length + ')' : 'Not set'}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error debugging scheduled emails:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the debug function
debugScheduler()
  .then(result => {
    if (!result.success) {
      console.error('Debug failed:', result.error);
      process.exit(1);
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 