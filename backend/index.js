const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const userRoutes = require('./routes/users');
const fieldUpdateRoutes = require('./routes/fieldUpdates');
const checkDatabase = require('./scripts/check-db');
const initializeDatabase = require('./scripts/init-db');

dotenv.config();

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

// Initialize database on startup
async function startServer() {
  try {
    console.log('Starting server, checking database...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');
    console.log('DB_HOST:', process.env.DB_HOST);
    
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
