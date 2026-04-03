// server/controllers/courseController.js
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ── CREATE COURSE ──
exports.createCourse = async (req, res) => {
  try {
    const { name, description } = req.body;

    const course = await Course.create({
      name,
      description,
      createdBy: req.user.userId,
    });

    return successResponse(res, 201, 'Course create ho gaya!', { course });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET ALL COURSES ──
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Courses fetched!', { courses });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET SINGLE COURSE ──
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!course) return errorResponse(res, 404, 'Course nahi mila!');

    // us course ke saare subjects bhi bhejo
    const subjects = await Subject.find({
      courseId: req.params.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, 'Course fetched!', { course, subjects });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── UPDATE COURSE ──
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course) return errorResponse(res, 404, 'Course nahi mila!');

    return successResponse(res, 200, 'Course updated!', { course });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── DELETE COURSE ──
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return errorResponse(res, 404, 'Course nahi mila!');

    // subjects bhi delete karo
    await Subject.deleteMany({ courseId: req.params.id });

    return successResponse(res, 200, 'Course deleted!');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};