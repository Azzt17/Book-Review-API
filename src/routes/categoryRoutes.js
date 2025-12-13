const express = require('express');
const { getAllCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const validate = require('../middleware/validationMiddleware');
const { createCategorySchema } = require('../validators/schemas');

const router = express.Router();

// Public: Semua orang bisa lihat kategori
router.get('/', getAllCategories);

// Protected (Admin Only): Hanya admin bisa tambah/hapus
router.post('/', authenticate, authorize('ADMIN'), validate(createCategorySchema), createCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory);

module.exports = router;