const pool = require('../config/database');

async function checkDatabase() {
  try {
    console.log('Checking database connection...');
    
    // Check if users table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tableExists = result.rows[0].exists;
    
    if (tableExists) {
      console.log('Database tables already exist');
      
      // Check if there's data
      const userCount = await pool.query('SELECT COUNT(*) FROM users');
      console.log(`Found ${userCount.rows[0].count} users in database`);
      
      return true;
    } else {
      console.log('Database tables do not exist');
      return false;
    }
    
  } catch (error) {
    console.error('Error checking database:', error);
    return false;
  } finally {
    await pool.end();
  }
}

module.exports = checkDatabase;
