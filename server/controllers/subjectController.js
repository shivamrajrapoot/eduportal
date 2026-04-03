// server/controllers/subjectController.js
const Subject = require('../models/Subject');
const Test = require('../models/Test');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ── CREATE SUBJECT ──
exports.createSubject = async (req, res) => {
  try {
    const { name, description, courseId } = req.body;

    const subject = await Subject.create({
      name,
      description,
      courseId,
      createdBy: req.user.userId,
    });

    return successResponse(res, 201, 'Subject create ho gaya!', { subject });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET ALL SUBJECTS OF A COURSE ──
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      courseId: req.params.courseId,
      isActive: true,
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, 'Subjects fetched!', { subjects });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET SINGLE SUBJECT ──
exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('courseId', 'name');

    if (!subject) return errorResponse(res, 404, 'Subject nahi mila!');

    // us subject ke saare tests bhi bhejo
    const tests = await Test.find({
      subjectId: req.params.id,
      isPublished: true,
    }).sort({ createdAt: -1 });

    return successResponse(res, 200, 'Subject fetched!', { subject, tests });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── UPDATE SUBJECT ──
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!subject) return errorResponse(res, 404, 'Subject nahi mila!');

    return successResponse(res, 200, 'Subject updated!', { subject });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── DELETE SUBJECT ──
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return errorResponse(res, 404, 'Subject nahi mila!');

    return successResponse(res, 200, 'Subject deleted!');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};