import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'recap_blog',
  waitForConnections: true,
  connectionLimit: 50, // Increased from 10 to handle more concurrent requests
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Execute query helper
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T> {
  let connection;
  try {
    // Use pool.execute which automatically handles connection management
    const [results] = await pool.execute(sql, params || []);
    return results as T;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
  // Note: pool.execute automatically releases the connection, so we don't need to manually release
}

// Get connection from pool (for transactions)
export async function getConnection() {
  return await pool.getConnection();
}

export default pool;

