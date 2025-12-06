const rateLimit = require('express-rate-limit');

// 1. Limiter Umum (Diterapkan ke semua route)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per IP
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit'
  },
  standardHeaders: true, // Return rate limit info di headers `RateLimit-*`
  legacyHeaders: false, // Disable headers `X-RateLimit-*`
});

// 2. Limiter Khusus Auth (Login/Register) 
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 10, // Maksimal 10 percobaan login/register
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login, silakan tunggu 15 menit.'
  }
});

module.exports = { globalLimiter, authLimiter };