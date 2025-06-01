import mysql from "mysql2/promise"
import fs from "fs"
import path from "path"

let initialized = false

// Get database config from environment variables
const DB_CONFIG = {
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3307"),
  user: process.env.MYSQL_USER || "root", 
  password: process.env.MYSQL_PASSWORD || "rootpassword",
  database: process.env.MYSQL_DATABASE || "autoflow"
}

// Initialize database and tables
export async function initializeDatabase() {
  if (initialized) return
  
  // First connect without database to create it if needed
  try {
    const connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      multipleStatements: true
    })
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}`)
    await connection.end()
    
    // Now connect with database selected
    const dbConnection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      database: DB_CONFIG.database,
      multipleStatements: true
    })
    
    // Create tables from schema
    const schemaPath = path.join(process.cwd(), "lib", "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")
    await dbConnection.query(schema)
    console.log("Database and tables initialized successfully")
    
    await dbConnection.end()
    initialized = true
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error; // Rethrow the error to prevent silently failing
  }
}

// Database connection configuration
export async function createConnection() {
  // Make sure database is initialized before connecting
  try {
    await initializeDatabase()
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
  
  return await mysql.createConnection({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
    multipleStatements: true
  })
}

// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  // Ensure database is initialized
  try {
    await initializeDatabase()
  } catch (error) {
    console.error("Failed to initialize database before query:", error)
  }
  
  const connection = await createConnection()
  try {
    const [results] = await connection.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  } finally {
    await connection.end()
  }
}
