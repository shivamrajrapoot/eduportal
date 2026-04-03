// server/routes/testRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');
const courseTeacherGuard = require('../middleware/courseTeacherGuard');
const {
  createTest,
  getAllTests,
  getTest,
  updateTest,
  togglePublish,
  deleteTest,
  getTestPreview,
} = require('../controllers/testController');

// Admin + Teacher — sirf assigned course mein
router.post('/create', verifyToken, roleGuard('admin', 'teacher'), courseTeacherGuard, createTest);
router.put('/update/:id', verifyToken, roleGuard('admin', 'teacher'), updateTest);
router.put('/publish/:id', verifyToken, roleGuard('admin', 'teacher'), togglePublish);
router.delete('/delete/:id', verifyToken, roleGuard('admin'), deleteTest);

// Preview — admin + teacher only
router.get('/preview/:id', verifyToken, roleGuard('admin', 'teacher'), getTestPreview);

// All logged in users
router.get('/all', verifyToken, getAllTests);
router.get('/:id', verifyToken, getTest);

module.exports = router;