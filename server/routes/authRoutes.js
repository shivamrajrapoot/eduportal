// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const {
  register,
  login,
  logout,
  refreshToken,
  googleCallback,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/refresh
router.get('/refresh', refreshToken);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// PUT /api/auth/reset-password/:token
router.put('/reset-password/:token', resetPassword);

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

module.exports = router;