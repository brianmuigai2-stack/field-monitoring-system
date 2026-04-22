const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const userRoutes = require('./routes/users');
const fieldUpdateRoutes = require('./routes/fieldUpdates');
const initializeDatabase = require('./scripts/init-db');

const app = express();
const PORT = process.env.PORT || 5000;

const isProduction = process.env.NODE_ENV === 'production';

const allowedOrigins = isProduction
  ? ['https://field-monitoring-system.vercel.app', 'https://field-monitoring-system.onrender.com']
  : true;

app.use(cors({
  origin: allowedOrigins,
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
    console.log('Starting server, initializing database...');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'NOT SET');
    
    // Always initialize (idempotent: creates tables if needed, runs migrations, seeds data)
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();