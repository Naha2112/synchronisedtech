import mysql from "mysql2/promise"

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
