import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

async function getConnection() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'autoflow',
    });
  }
  return connection;
}

export async function query(sql: string, params?: any[]) {
  try {
    const conn = await getConnection();
    const [results] = await conn.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default connection; 