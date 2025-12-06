const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // 1. Ambil header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Akses ditolak. Token tidak ditemukan atau format salah.' 
    });
  }

  // 2. Ambil tokennya saja (buang kata 'Bearer ')
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Simpan data user ke dalam request object agar bisa dipakai di controller
    req.user = decoded; 

    next(); // Lanjut ke controller berikutnya
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak valid atau kadaluwarsa.' 
    });
  }
};

module.exports = authenticate;