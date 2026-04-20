const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const fieldRoutes = require('./routes/fields');
const userRoutes = require('./routes/users');
const fieldUpdateRoutes = require('./routes/fieldUpdates');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fields', fieldRoutes);
app.use('/api/users', userRoutes);
app.use('/api/field-updates', fieldUpdateRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SmartSeason Field Monitoring System API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
