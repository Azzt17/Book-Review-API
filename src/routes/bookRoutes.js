const express = require('express');
const { getAllBooks, getBookById, createBook, deleteBook } = require('../controllers/bookController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { createBookSchema } = require('../validators/schemas');
const validate = require('../middleware/validationMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Admin Routes
router.post('/', authenticate, authorize('ADMIN'), validate(createBookSchema), createBook);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteBook);

module.exports = router;