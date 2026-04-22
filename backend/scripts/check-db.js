const { Pool } = require('pg');

async function checkDatabase() {
  // Use DATABASE_URL if available (Render provides this), otherwise use individual vars
  const connectionString = process.env.DATABASE_URL || 
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  
  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Checking database connection...');
    
    // Check if users table exists
    const tableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tableExists = tableResult.rows[0].exists;
    
    if (!tableExists) {
      console.log('Users table does not exist');
      return false;
    }
    
    console.log('✓ Users table exists');
    
    // Check if password_hash column exists
    const columnResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'users' 
        AND column_name = 'password_hash'
      );
    `);
    
    const columnExists = columnResult.rows[0].exists;
    
    if (!columnExists) {
      console.log('✗ Missing required column: password_hash');
      console.log('Run: npm run migrate to add missing columns');
      return false;
    }
    
    console.log('✓ password_hash column exists');
    
    // Check if there's data
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`Found ${userCount.rows[0].count} users in database`);
    
    return true;
    
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  } finally {
    await pool.end();
  }
}

module.exports = checkDatabase;
