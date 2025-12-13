const Joi = require('joi');

// Schema untuk Registrasi
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Schema untuk Login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Schema untuk Membuat Buku
const createBookSchema = Joi.object({
  title: Joi.string().min(3).required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  releaseYear: Joi.number().integer().min(1000).max(new Date().getFullYear()).required(),
  categoryIds: Joi.array().items(Joi.number().integer()).min(1).required() // Minimal 1 kategori
});

// Schema untuk Membuat Kategory
const createCategorySchema = Joi.object({
  name: Joi.string()
    .trim()          // Hapus spasi di awal/akhir
    .min(3)          // Wajib minimal 3 karakter (cegah string kosong/pendek)
    .required()      // Wajib diisi
    .messages({
      'string.empty': 'Nama kategori tidak boleh kosong',
      'string.min': 'Nama kategori minimal 3 karakter',
      'any.required': 'Nama kategori wajib diisi'
    })
});

// Schema untuk Membuat Review
const createReviewSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(), // Rating cuma boleh 1-5
  content: Joi.string().min(5).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  createBookSchema,
  createReviewSchema,
  createCategorySchema
};