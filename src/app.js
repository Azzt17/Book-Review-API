const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); // Logger
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();

// --- 1. Middleware Global ---
app.use(helmet()); // Mengamankan HTTP headers
app.use(cors());   // Mengizinkan akses cross-origin
app.use(morgan('dev')); // Logging request ke console
app.use(express.json()); // Parsing JSON body
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Book Review API is running successfully!',
    serverTime: new Date().toISOString()
  });
});
app.use('/api/auth', authRoutes);

// --- 3. 404 Handler (Jika route tidak ditemukan) ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// --- 4. Server Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});