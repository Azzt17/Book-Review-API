const express = require('express');
const { createReview, getReviewsByBook, deleteReview } = require('../controllers/reviewController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Public: Siapa saja boleh lihat review buku
router.get('/book/:bookId', getReviewsByBook);

// Protected: Harus login untuk menulis review
router.post('/', authenticate, createReview);

// Protected: Harus login untuk hapus (Ownership check ada di controller)
router.delete('/:id', authenticate, deleteReview);

module.exports = router;