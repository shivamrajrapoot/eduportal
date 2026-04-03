// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');
const {
  getAllUsers,
  changeUserRole,
  assignTeacher,
  removeTeacher,
  getCourseTeachers,
  getUserActivity,
  getCourseStudentsResults,
} = require('../controllers/adminController');

// Admin only routes
router.use(verifyToken);

// Admin only
router.get('/users', roleGuard('admin'), getAllUsers);
router.put('/users/role', roleGuard('admin'), changeUserRole);
router.post('/assign-teacher', roleGuard('admin'), assignTeacher);
router.delete('/remove-teacher', roleGuard('admin'), removeTeacher);
router.get('/course-teachers/:courseId', roleGuard('admin'), getCourseTeachers);
router.get('/user-activity/:userId', roleGuard('admin'), getUserActivity);

// Admin + Teacher
router.get('/course-results/:courseId', roleGuard('admin', 'teacher'), getCourseStudentsResults);

module.exports = router;