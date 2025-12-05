const errorHandler = (err, req, res, next) => {
  console.error(err); // Log error ke console server (untuk developer)

  // Default Status & Message
  let statusCode = 500;
  let message = 'Terjadi kesalahan pada server (Internal Server Error)';

  // --- 1. Error dari Prisma (Database) ---
  if (err.code) {
    switch (err.code) {
      case 'P2002': // Unique Constraint Violation (Contoh: Email sudah ada)
        statusCode = 409; // Conflict
        message = 'Data sudah ada (Duplikat). Cek field unik seperti email atau judul.';
        break;
      case 'P2025': // Record Not Found
        statusCode = 404;
        message = 'Data tidak ditemukan untuk operasi ini.';
        break;
      default:
        message = `Database Error: ${err.message}`;
    }
  }

  // --- 2. Error dari JWT ---
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token tidak valid.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token telah kadaluwarsa, silakan login ulang.';
  }

  // --- Kirim Response Akhir ---
  res.status(statusCode).json({
    success: false,
    message: message,
    // Di production, jangan kirim stack trace!
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;