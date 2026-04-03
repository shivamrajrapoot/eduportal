// server/middleware/courseTeacherGuard.js
const CourseTeacher = require('../models/CourseTeacher');
const { errorResponse } = require('../utils/apiResponse');

// Check karo — teacher us course mein assigned hai?
const courseTeacherGuard = async (req, res, next) => {
  try {
    // admin ko sab allowed hai
    if (req.user.role === 'admin') {
      return next();
    }

    // courseId — body ya params se lo
    const courseId = req.body.courseId || req.params.courseId;

    if (!courseId) {
      return errorResponse(res, 400, 'courseId required hai!');
    }

    // teacher assigned hai?
    const assignment = await CourseTeacher.findOne({
      courseId,
      teacherId: req.user.userId,
      isActive: true,
    });

    if (!assignment) {
      return errorResponse(res, 403, 'Tum is course ke teacher nahi ho!');
    }

    next();
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = courseTeacherGuard;