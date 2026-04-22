const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  // Use DATABASE_URL if available (Render provides this), otherwise use individual vars
  const connectionString = process.env.DATABASE_URL || 
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  
  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Initializing database...');
    
    // Step 1: Create/update tables (DDL only)
    console.log('Step 1: Creating/updating tables...');
    const initSqlPath = path.join(__dirname, '../database/init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    await pool.query(initSql);
    console.log('✓ Tables ready');
    
    // Step 2: Run migrations (adds missing columns to existing tables)
    console.log('Step 2: Running migrations...');
    const migrationsPath = path.join(__dirname, '../database/migrations');
    if (fs.existsSync(migrationsPath)) {
      const migrationFiles = fs.readdirSync(migrationsPath)
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      for (const migration of migrationFiles) {
        console.log(`Applying migration: ${migration}`);
        const migrationSql = fs.readFileSync(path.join(migrationsPath, migration), 'utf8');
        await pool.query(migrationSql);
      }
      console.log('✓ Migrations completed');
    } else {
      console.log('No migrations directory found');
    }
    
    // Step 3: Seed data (only if empty)
    console.log('Step 3: Seeding initial data...');
    const seedSqlPath = path.join(__dirname, '../database/seed.sql');
    if (fs.existsSync(seedSqlPath)) {
      const seedSql = fs.readFileSync(seedSqlPath, 'utf8');
      await pool.query(seedSql);
      console.log('✓ Seed data inserted');
    } else {
      console.log('No seed file found');
    }
    
    console.log('Database initialization completed successfully!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;
