// server/controllers/adminController.js
const User = require('../models/User');
const Course = require('../models/Course');
const CourseTeacher = require('../models/CourseTeacher');
const Attempt = require('../models/Attempt');
const Response = require('../models/Response');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ── GET ALL USERS ──
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email mobile role authProvider createdAt')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Users fetched!', { users });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── CHANGE USER ROLE ──
exports.changeUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!['user', 'teacher', 'admin'].includes(role)) {
      return errorResponse(res, 400, 'Invalid role!');
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('name email role');

    if (!user) return errorResponse(res, 404, 'User nahi mila!');

    return successResponse(res, 200, `User ka role ${role} kar diya!`, { user });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── ASSIGN TEACHER TO COURSE ──
exports.assignTeacher = async (req, res) => {
  try {
    const { courseId, teacherId } = req.body;

    // teacher exist karta hai?
    const teacher = await User.findById(teacherId);
    if (!teacher) return errorResponse(res, 404, 'Teacher nahi mila!');
    if (teacher.role !== 'teacher') {
      return errorResponse(res, 400, 'Yeh user teacher nahi hai!');
    }

    // course exist karta hai?
    const course = await Course.findById(courseId);
    if (!course) return errorResponse(res, 404, 'Course nahi mila!');

    // assign karo
    const assignment = await CourseTeacher.create({
      courseId,
      teacherId,
      assignedBy: req.user.userId,
    });

    return successResponse(res, 201, `Teacher ${teacher.name} ko course assign kar diya!`, { assignment });
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 400, 'Teacher already is course mein assign hai!');
    }
    return errorResponse(res, 500, error.message);
  }
};

// ── REMOVE TEACHER FROM COURSE ──
exports.removeTeacher = async (req, res) => {
  try {
    const { courseId, teacherId } = req.body;

    await CourseTeacher.findOneAndDelete({ courseId, teacherId });

    return successResponse(res, 200, 'Teacher remove kar diya!');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET COURSE TEACHERS ──
exports.getCourseTeachers = async (req, res) => {
  try {
    const teachers = await CourseTeacher.find({ courseId: req.params.courseId })
      .populate('teacherId', 'name email mobile')
      .populate('assignedBy', 'name');

    return successResponse(res, 200, 'Teachers fetched!', { teachers });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET ANY USER ACTIVITY (Admin only) ──
exports.getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('name email mobile role createdAt');

    if (!user) return errorResponse(res, 404, 'User nahi mila!');

    // user ke saare attempts
    const attempts = await Attempt.find({ userId, status: 'completed' })
      .populate('testId', 'title totalMarks courseId subjectId')
      .sort({ createdAt: -1 });

    // stats
    const totalAttempts = attempts.length;
    const avgAccuracy = totalAttempts > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.accuracy, 0) / totalAttempts)
      : 0;
    const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);

    return successResponse(res, 200, 'User activity fetched!', {
      user,
      attempts,
      stats: {
        totalAttempts,
        avgAccuracy,
        totalScore,
      }
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET COURSE STUDENTS RESULTS (Teacher) ──
exports.getCourseStudentsResults = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    // teacher assigned hai check karo
    if (req.user.role === 'teacher') {
      const CourseTeacher = require('../models/CourseTeacher');
      const assignment = await CourseTeacher.findOne({
        courseId,
        teacherId: userId,
        isActive: true,
      });
      if (!assignment) {
        return errorResponse(res, 403, 'Tum is course ke teacher nahi ho!');
      }
    }

    // us course ke saare attempts
    const attempts = await Attempt.find({ status: 'completed' })
      .populate({
        path: 'testId',
        match: { courseId },
        select: 'title totalMarks courseId',
      })
      .populate('userId', 'name email mobile')
      .sort({ createdAt: -1 });

    // sirf us course ke attempts filter karo
    const filtered = attempts.filter(a => a.testId !== null);

    return successResponse(res, 200, 'Students results fetched!', {
      results: filtered,
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};