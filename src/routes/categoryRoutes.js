const express = require('express');
const { getAllCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

// Public: Semua orang bisa lihat kategori
router.get('/', getAllCategories);

// Protected (Admin Only): Hanya admin bisa tambah/hapus
router.post('/', authenticate, authorize('ADMIN'), createCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory);

module.exports = router;