const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL || 
    `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  
  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Running database migrations...');
    
    const migrationsPath = path.join(__dirname, '../database/migrations');
    const migrationFiles = fs.readdirSync(migrationsPath)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('No migrations found.');
      return;
    }

    for (const migration of migrationFiles) {
      console.log(`Applying migration: ${migration}`);
      const migrationSql = fs.readFileSync(path.join(migrationsPath, migration), 'utf8');
      await pool.query(migrationSql);
      console.log(`✓ ${migration} applied successfully`);
    }
    
    console.log('All migrations completed!');
    
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      process.exit(1);
    });
}

module.exports = runMigrations;
