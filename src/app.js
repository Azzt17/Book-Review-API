const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); 
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const errorHandler = require('./middleware/errorMiddleware');
const compression = require('compression');
const { globalLimiter } = require('./middleware/rateLimitMiddleware');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// --- Middleware Global ---
app.use(helmet()); // Mengamankan HTTP headers (optional middleware)
// [UPDATE] Konfigurasi CORS
// Kita izinkan semua (*) untuk fase development/testing
// Tapi kita siapkan logic-nya untuk Production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? '*' : '*', // Ganti '*' dengan domain frontend nanti
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));   // Mengizinkan akses cross-origin (optional middleware)

// --- Logging Middleware dengan Morgan ---
// [NEW] Mode A: Log ke Console (Singkat)
app.use(morgan('dev'));

// [NEW] Mode B: Log ke File Eksternal 'access.log' (Lengkap, standar Apache)
// Buat write stream (mode append)
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// --- Performance Middleware ---
app.use(compression()); // Mengompresi response (optional middleware)
app.use(globalLimiter); // Menerapkan rate limiting global (optional middleware)

// --- Body Parser Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'UP', 
    message: 'Book Review API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});
app.get('/api', (req, res) => {
  res.status(200).json({
    status: 'UP', 
    message: 'Book Review API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// --- 404 Handler (Jika route tidak ditemukan) ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// --- Error Handling Middleware ---
app.use(errorHandler);

// --- Server Start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});