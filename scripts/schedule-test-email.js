#!/usr/bin/env node

/**
 * Test script for scheduling an email to be sent automatically
 * This schedules an email for 2 minutes in the future
 */

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function scheduleTestEmail() {
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
    
    // Create a date 2 minutes in the future
    const futureDate = new Date(now.getTime() + 120000); // 120000ms = 2 minutes
    
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
        "nahavipusan21@gmail.com",
        "AUTO SCHEDULER TEST EMAIL",
        "<p>This is a test email sent by the auto-scheduler at " + now.toLocaleString() + "</p>",
        mysqlDateString,
        1, // User ID 1
        "scheduled"
      ]
    );
    
    console.log("Test email scheduled successfully");
    console.log(`The auto-scheduler should send this email at approximately ${futureDate.toLocaleString()}`);
    console.log("Check your email inbox in about 2 minutes!");
    
    return { success: true };
  } catch (error) {
    console.error("Error scheduling test email:", error);
    return { success: false, error: error.message };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the test
console.log("=== Auto Scheduler Test ===");
scheduleTestEmail()
  .then(result => {
    console.log("\nTest completed with result:", result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  }); 