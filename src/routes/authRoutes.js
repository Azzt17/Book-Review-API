// src/routes/authRoutes.js
const express = require('express');

// 1. Pastikan Anda mengimpor 'getMe' dari controller
const { register, login, getMe } = require('../controllers/authController');

// 2. Pastikan Anda mengimpor middleware 'authenticate'
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Route untuk Register & Login (Public)
router.post('/register', register);
router.post('/login', login);

// Route untuk Profil (Protected)
// Sekarang variabel 'authenticate' dan 'getMe' sudah dikenali
router.get('/me', authenticate, getMe);

module.exports = router;