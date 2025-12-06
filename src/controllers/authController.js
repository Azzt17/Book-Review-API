const { PrismaClient } = require('@prisma/client');
const { hashPassword, comparePassword, generateTokens } = require('../utils/authUtils');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// --- 1. REGISTER ---
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validasi sederhana (nanti kita perkuat dengan Joi)
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }

    // Cek apakah email sudah ada
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar' }); // 409 Conflict [cite: 147]
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER' // Default role
      }
    });

    // Hapus password dari respons agar aman
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: userWithoutPassword
    }); 

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// --- 2. LOGIN ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' }); // 401 Unauthorized [cite: 146]
    }

    // Verifikasi password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    // Generate Token
    const tokens = generateTokens(user);

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        tokens
      }
    }); // 200 OK

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// --- 3. GET CURRENT USER (PROTECTED) ---
const getMe = async (req, res) => {
  try {
    // req.user didapat dari middleware authenticate
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.status(200).json({
      success: true,
      message: 'Profil user berhasil diambil',
      data: user
    });
  } catch (error) {
    next(error); // Oper ke error handling middleware
  }
};

// --- 4. REFRESH TOKEN ---
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh Token wajib diisi' });
    }

    // Verifikasi Refresh Token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Refresh Token tidak valid atau kadaluwarsa' });
      }

      // Jika valid, buat Access Token baru
      // Kita butuh data user minimal (id & role) untuk payload
      const payload = { 
        id: decoded.id, 
        role: decoded.role 
      };

      const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m' // Sesuai spec: 15 menit
      });

      res.json({
        success: true,
        accessToken: newAccessToken
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// Update module.exports
module.exports = { register, login, getMe, refreshToken };