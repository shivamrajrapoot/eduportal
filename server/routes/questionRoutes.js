// server/routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');
const {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} = require('../controllers/questionController');

// Admin only
router.post('/add', verifyToken, roleGuard('admin'), addQuestion);
router.put('/update/:id', verifyToken, roleGuard('admin'), updateQuestion);
router.delete('/delete/:id', verifyToken, roleGuard('admin'), deleteQuestion);

// All logged in users
router.get('/:testId', verifyToken, getQuestions);

module.exports = router;