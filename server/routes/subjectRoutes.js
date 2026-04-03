// server/routes/subjectRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');
const courseTeacherGuard = require('../middleware/courseTeacherGuard');
const {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');

// Admin + Teacher — but sirf assigned course mein
router.post('/create', verifyToken, roleGuard('admin', 'teacher'), courseTeacherGuard, createSubject);
router.put('/update/:id', verifyToken, roleGuard('admin', 'teacher'), updateSubject);
router.delete('/delete/:id', verifyToken, roleGuard('admin'), deleteSubject);

// All logged in users
router.get('/course/:courseId', verifyToken, getSubjects);
router.get('/:id', verifyToken, getSubject);

module.exports = router;