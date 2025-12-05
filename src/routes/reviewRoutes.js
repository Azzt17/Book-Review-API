const express = require('express');
const { createReview, getReviewsByBook, deleteReview } = require('../controllers/reviewController');
const authenticate = require('../middleware/authMiddleware');
const { createReviewSchema } = require('../validators/schemas');
const validate = require('../middleware/validationMiddleware');

const router = express.Router();

// Public: Siapa saja boleh lihat review buku
router.get('/book/:bookId', getReviewsByBook);

// Protected: Harus login untuk menulis review
router.post('/', authenticate, validate(createReviewSchema), createReview);

// Protected: Harus login untuk hapus (Ownership check ada di controller)
router.delete('/:id', authenticate, deleteReview);

module.exports = router;