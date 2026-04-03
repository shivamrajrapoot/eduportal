// server/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getUserAnalytics,
  getQuestionAnalytics,
} = require('../controllers/analyticsController');

// All logged in users
router.get('/user', verifyToken, getUserAnalytics);
router.get('/question/:questionId', verifyToken, getQuestionAnalytics);

module.exports = router;