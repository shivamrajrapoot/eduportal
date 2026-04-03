// server/routes/attemptRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  startTest,
  submitTest,
  getResult,
  checkAttempt,
} = require('../controllers/attemptController');

// All logged in users
router.post('/start', verifyToken, startTest);
router.post('/submit', verifyToken, submitTest);
router.get('/result/:attemptId', verifyToken, getResult);
router.get('/check/:testId', verifyToken, checkAttempt);

module.exports = router;