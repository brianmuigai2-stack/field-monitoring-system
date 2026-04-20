const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const userRoutes = require('./routes/users');
const fieldUpdateRoutes = require('./routes/fieldUpdates');
const checkDatabase = require('./scripts/check-db');
const initializeDatabase = require('./scripts/init-db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://field-monitoring-system.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/users', userRoutes);
app.use('/api/field-updates', fieldUpdateRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SmartSeason Field Monitoring System API' });
});

app.get('/test-db', async (req, res) => {
  try {
    const pool = require('./config/database');
    const result = await pool.query('SELECT * FROM users LIMIT 5');
    res.json({ success: true, users: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function startServer() {
  try {
    console.log('Starting server, checking database...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'NOT SET');
    
    const dbExists = await checkDatabase();
    console.log('Database exists check result:', dbExists);
    
    if (!dbExists) {
      console.log('Database not initialized. Running setup...');
      await initializeDatabase();
      console.log('Database initialized successfully!');
    } else {
      console.log('Database already exists. Skipping initialization.');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();