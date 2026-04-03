// server/controllers/testController.js
const Test = require('../models/Test');
const Question = require('../models/Question');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ── CREATE TEST ──
exports.createTest = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      totalMarks,
      passingMarks,
      negativeMarking,
      courseId,
      subjectId,
    } = req.body;

    const test = await Test.create({
      title,
      description,
      duration,
      totalMarks,
      passingMarks,
      negativeMarking,
      courseId,
      subjectId,
      createdBy: req.user.userId,
    });

    return successResponse(res, 201, 'Test created!', { test });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET ALL TESTS ──
exports.getAllTests = async (req, res) => {
  try {
    // admin — sab tests dekhe
    // user — sirf published tests dekhe
    const filter = req.user.role === 'admin' ? {} : { isPublished: true };

    const tests = await Test.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Tests fetched!', { tests });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET SINGLE TEST ──
exports.getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!test) return errorResponse(res, 404, 'Test nahi mila!');

    // user sirf published test dekh sakta hai
    if (req.user.role !== 'admin' && !test.isPublished) {
      return errorResponse(res, 403, 'Test available nahi hai!');
    }

    // questions bhi bhejo
    const questions = await Question.find({ testId: test._id }).sort({ order: 1 });

    return successResponse(res, 200, 'Test fetched!', { test, questions });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── UPDATE TEST ──
exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!test) return errorResponse(res, 404, 'Test nahi mila!');

    return successResponse(res, 200, 'Test updated!', { test });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── PUBLISH / UNPUBLISH TEST ──
exports.togglePublish = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return errorResponse(res, 404, 'Test nahi mila!');

    test.isPublished = !test.isPublished;
    await test.save();

    return successResponse(res, 200,
      test.isPublished ? 'Test published!' : 'Test unpublished!',
      { test }
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── DELETE TEST ──
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return errorResponse(res, 404, 'Test nahi mila!');

    // questions bhi delete karo
    await Question.deleteMany({ testId: req.params.id });

    return successResponse(res, 200, 'Test deleted!');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET TEST PREVIEW (Teacher/Admin only) ──
exports.getTestPreview = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('courseId', 'name')
      .populate('subjectId', 'name');

    if (!test) return errorResponse(res, 404, 'Test nahi mila!');

    // questions with correct answers — preview mein sab dikhao
    const questions = await Question.find({ testId: test._id })
      .sort({ order: 1 });

    return successResponse(res, 200, 'Test preview fetched!', {
      test,
      questions,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};