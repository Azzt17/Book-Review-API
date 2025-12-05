// src/utils/authUtils.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi Hash Password
const hashPassword = async (password) => {
  const saltRounds = 10; // Sesuai spec: min 10 rounds 
  return await bcrypt.hash(password, saltRounds);
};

// Fungsi Cek Password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Fungsi Generate Token (Access & Refresh)
const generateTokens = (user) => {
  const payload = { 
    id: user.id, 
    role: user.role 
  };

  // Access Token (Short-lived)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });

  // Refresh Token (Long-lived)
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

  return { accessToken, refreshToken };
};

module.exports = {
  hashPassword,
  comparePassword,
  generateTokens
};