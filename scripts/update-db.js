// Update database schema for scheduled_emails table
const mysql = require('mysql2/promise');

async function updateDatabase() {
  let connection;
  
  try {
    // Connect to the database
    connection = await mysql.createConnection({
      host: "localhost",
      port: 3306,
      user: "root",
      password: "password",
      database: "autoflow",
      multipleStatements: true
    });
    
    console.log('Connected to database');
    
    // Check if the column exists before adding it to avoid errors
    const [columns] = await connection.query(`SHOW COLUMNS FROM scheduled_emails LIKE 'recipient'`);
    
    if (columns.length === 0) {
      console.log('Adding recipient column to scheduled_emails table');
      await connection.query(`
        ALTER TABLE scheduled_emails 
        ADD COLUMN recipient VARCHAR(255) NOT NULL AFTER email_template_id,
        ADD COLUMN subject VARCHAR(255) NOT NULL AFTER recipient,
        ADD COLUMN body TEXT NOT NULL AFTER subject,
        MODIFY COLUMN recipient_type ENUM('client', 'client_group', 'all', 'direct') DEFAULT 'direct',
        MODIFY COLUMN status ENUM('scheduled', 'sent', 'failed') DEFAULT 'scheduled',
        ADD COLUMN sent_date DATETIME NULL AFTER scheduled_date
      `);
      console.log('Successfully updated scheduled_emails table schema');
    } else {
      console.log('The recipient column already exists in scheduled_emails table');
    }
    
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

updateDatabase(); 