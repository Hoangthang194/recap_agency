const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

// Load environment variables manually (since we might not have dotenv)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'recap_blog',
};

async function resetAdminPassword() {
  const password = 'password123';
  const hash = bcrypt.hashSync(password, 10);

  console.log('🔐 Resetting admin password...');
  console.log('Password:', password);
  console.log('Generated hash:', hash);

  let connection;
  try {
    // Database connection
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Update admin password
    const [result] = await connection.execute(
      "UPDATE users SET password = ? WHERE email = 'admin@recap.local'",
      [hash]
    );

    if (result.affectedRows > 0) {
      console.log('\n✅ Password updated successfully!');
      console.log('Rows affected:', result.affectedRows);
      
      // Verify the update
      const [users] = await connection.execute(
        "SELECT id, name, email, role, status FROM users WHERE email = 'admin@recap.local'"
      );
      
      if (users.length > 0) {
        console.log('\n📋 User info:');
        console.log(users[0]);
      }
      
      console.log('\n🎉 You can now login with:');
      console.log('   Email: admin@recap.local');
      console.log('   Password: password123');
    } else {
      console.log('\n⚠️  No user found with email: admin@recap.local');
      console.log('   Please check if the user exists in the database.');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Cannot connect to database. Please check:');
      console.error('   - Database server is running');
      console.error('   - Database credentials in .env.local');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

resetAdminPassword();
