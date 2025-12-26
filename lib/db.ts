import mysql from 'mysql2/promise';

// Database configuration with optimized settings for high concurrency
const dbConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'recap_blog',
  
  // Connection pool settings
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '100'), // Increased to handle more concurrent users
  queueLimit: 0, // Unlimited queue, but connections will wait
  
  // Connection lifecycle
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  
  // SSL (if needed) - remove if not using SSL
  // ssl: false, // Commented out as it requires SslOptions type
  
  // Connection options
  multipleStatements: false, // Security: prevent SQL injection via multiple statements
  dateStrings: false, // Return dates as Date objects
  supportBigNumbers: true,
  bigNumberStrings: false,
  
  // Pool monitoring
  idleTimeout: 300000, // 5 minutes - close idle connections
  maxIdle: 10, // Maximum idle connections to keep
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Pool event listeners for monitoring
pool.on('connection', (connection: mysql.PoolConnection) => {
  console.log(`[DB] New connection established as id ${connection.threadId}`);
});

// Handle pool errors
process.on('unhandledRejection', (reason: any) => {
  if (reason?.code === 'PROTOCOL_CONNECTION_LOST' || 
      reason?.code === 'ER_CON_COUNT_ERROR' ||
      reason?.code === 'ECONNREFUSED') {
    console.error('[DB] Database connection error:', reason.message);
  }
});

// Test connection with retry logic
export async function testConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      console.log('✅ Database connection successful');
      return true;
    } catch (error: any) {
      console.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, error.message);
      if (i < retries - 1) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  return false;
}

// Execute query helper with retry logic
export async function query<T = any>(
  sql: string,
  params?: any[],
  retries = 2
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Use pool.execute which automatically handles connection management
      const [results] = await pool.execute(sql, params || []);
      return results as T;
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a connection error that might be retryable
      const isRetryable = 
        error.code === 'PROTOCOL_CONNECTION_LOST' ||
        error.code === 'ECONNREFUSED' ||
        error.code === 'ETIMEDOUT' ||
        error.code === 'ER_LOCK_WAIT_TIMEOUT' ||
        error.message?.includes('Too many connections');
      
      if (isRetryable && attempt < retries) {
        console.warn(`[DB] Query failed (attempt ${attempt + 1}/${retries + 1}), retrying...`, error.message);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
        continue;
      }
      
      // If not retryable or out of retries, throw
      console.error('[DB] Database query error:', {
        sql: sql.substring(0, 100),
        error: error.message,
        code: error.code,
      });
      throw error;
    }
  }
  
  throw lastError;
}

// Get connection from pool (for transactions)
// IMPORTANT: Always release the connection after use!
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error: any) {
    if (error.code === 'ER_CON_COUNT_ERROR' || error.message?.includes('Too many connections')) {
      console.error('[DB] Connection pool exhausted. Consider increasing connectionLimit or checking for connection leaks.');
    }
    throw error;
  }
}

// Get pool statistics for monitoring
// Note: mysql2 doesn't expose pool stats directly, so we return config info
export function getPoolStats() {
  return {
    connectionLimit: dbConfig.connectionLimit,
    // Note: Actual pool stats are not directly accessible via public API
    // Consider using a monitoring tool or custom metrics collection
  };
}

// Graceful shutdown
export async function closePool(): Promise<void> {
  try {
    await pool.end();
    console.log('[DB] Connection pool closed gracefully');
  } catch (error) {
    console.error('[DB] Error closing connection pool:', error);
    throw error;
  }
}

export default pool;

