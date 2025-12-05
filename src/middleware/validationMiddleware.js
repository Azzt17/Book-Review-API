const validate = (schema) => {
  return (req, res, next) => {
    // Validasi req.body menggunakan schema Joi
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Jika ada error, ambil pesan detailnya
      const errorMessages = error.details.map((detail) => detail.message);
      
      return res.status(400).json({
        success: false,
        message: 'Validasi Gagal',
        errors: errorMessages
      });
    }

    next(); // Jika valid, lanjut ke controller
  };
};

module.exports = validate;