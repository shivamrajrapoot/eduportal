// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');
const { completeProfile } = require('../controllers/authController');
const { getProfile, updateProfile } = require('../controllers/userController');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Profile routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// Complete profile — Google users ke liye
router.put('/complete-profile', verifyToken, completeProfile);

// Sirf admin
router.get('/admin', verifyToken, roleGuard('admin'), (req, res) => {
  res.json({ success: true, message: 'Admin panel!' });
});

// Student, Teacher, Admin
router.get('/results', verifyToken, roleGuard('user', 'teacher', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Results page!' });
});

module.exports = router;