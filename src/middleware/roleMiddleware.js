const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user berasal dari middleware authenticate sebelumnya
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses Ditolak: Anda tidak memiliki izin yang cukup.'
      });
    }
    next();
  };
};

module.exports = authorize;