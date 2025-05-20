import mysql from "mysql2/promise"
import { User } from "./auth"

// Add a server-only directive to ensure this code only runs on the server
import "server-only"

// Database connection configuration
export async function createConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
}

// Helper function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
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

// User-related database functions
export async function getUserByEmail(email: string) {
  const users = (await query("SELECT id, name, email, password_hash FROM users WHERE email = ?", [email])) as any[]
  return users.length > 0 ? users[0] : null
}

export async function getUserById(id: number) {
  const users = (await query("SELECT id, name, email FROM users WHERE id = ?", [id])) as any[]
  return users.length > 0 ? (users[0] as User) : null
} 