// server/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');
const {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');

// Admin + Teacher only
router.post('/create', verifyToken, roleGuard('admin', 'teacher'), createCourse);
router.put('/update/:id', verifyToken, roleGuard('admin', 'teacher'), updateCourse);
router.delete('/delete/:id', verifyToken, roleGuard('admin'), deleteCourse);

// All logged in users
router.get('/all', verifyToken, getAllCourses);
router.get('/:id', verifyToken, getCourse);

module.exports = router;