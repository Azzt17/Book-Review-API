const express = require('express');
const { register, login, getMe, refreshToken } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');
const { registerSchema, loginSchema } = require('../validators/schemas');
const validate = require('../middleware/validationMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.post('/refresh', refreshToken);

module.exports = router;