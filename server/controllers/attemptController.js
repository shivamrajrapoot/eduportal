// server/controllers/attemptController.js
const Attempt = require('../models/Attempt');
const Response = require('../models/Response');
const Question = require('../models/Question');
const Test = require('../models/Test');
const calculateScore = require('../utils/calculateScore');
const generateInsights = require('../utils/generateInsights');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { STATUS } = require('../constants/test.constants');

// ── START TEST ──
exports.startTest = async (req, res) => {
  try {
    const { testId } = req.body;
    const userId = req.user.userId;

    // test exist karta hai?
    const test = await Test.findById(testId);
    if (!test) return errorResponse(res, 404, 'Test nahi mila!');
    if (!test.isPublished) return errorResponse(res, 403, 'Test available nahi hai!');

    // teacher aur admin test nahi de sakte — sirf preview
    if (req.user.role === 'teacher' || req.user.role === 'admin') {
      return errorResponse(res, 403, 'Teacher aur Admin test nahi de sakte — preview use karo!');
    }

    // pehle se attempt kiya hai?
    const existingAttempt = await Attempt.findOne({ userId, testId });
    if (existingAttempt) {
      return errorResponse(res, 400, 'Tumne yeh test pehle de diya hai! Practice mode use karo.');
    }

    // naya attempt banao
    const attempt = await Attempt.create({
      userId,
      testId,
      totalMarks: test.totalMarks,
      startTime: new Date(),
      status: STATUS.IN_PROGRESS,
    });

    // questions lo — correctAnswer nahi bhejo frontend ko
    const questions = await Question.find({ testId })
      .select('-correctAnswer -explanation')
      .sort({ order: 1 });

    return successResponse(res, 201, 'Test shuru!', {
      attemptId: attempt._id,
      questions,
      duration: test.duration,
      totalMarks: test.totalMarks,
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── SUBMIT TEST ──
exports.submitTest = async (req, res) => {
  try {
    const { attemptId, responses, timeTaken } = req.body;

    // attempt dhundo
    const attempt = await Attempt.findById(attemptId);
    if (!attempt) return errorResponse(res, 404, 'Attempt nahi mila!');
    if (attempt.status === STATUS.COMPLETED) {
      return errorResponse(res, 400, 'Test pehle hi submit ho chuka hai!');
    }

    // test aur questions lo
    const test = await Test.findById(attempt.testId);
    const questions = await Question.find({ testId: attempt.testId });

    // score calculate karo
    const result = calculateScore(responses, questions, test.negativeMarking);

    // responses DB mein save karo
    const savedResponses = await Response.insertMany(
      responses.map(r => ({
        attemptId,
        questionId: r.questionId,
        selectedAnswer: r.selectedAnswer || null,
        markedForReview: r.markedForReview || false,
        timeTaken: r.timeTaken || 0,
        isCorrect: r.isCorrect,
        status: r.status,
      }))
    );

    // attempt update karo
    attempt.score = result.score;
    attempt.correct = result.correct;
    attempt.incorrect = result.incorrect;
    attempt.skipped = result.skipped;
    attempt.markedForReview = result.markedForReview;
    attempt.accuracy = result.accuracy;
    attempt.timeTaken = timeTaken;
    attempt.endTime = new Date();
    attempt.status = STATUS.COMPLETED;
    await attempt.save();

    // insights generate karo
    const insights = generateInsights(savedResponses, questions);

    return successResponse(res, 200, 'Test submit ho gaya!', {
      result,
      insights,
      attemptId,
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET RESULT ──
exports.getResult = async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.attemptId)
      .populate('testId', 'title duration totalMarks negativeMarking');

    if (!attempt) return errorResponse(res, 404, 'Result nahi mila!');

    // sirf apna result dekh sakta hai
    if (attempt.userId.toString() !== req.user.userId) {
      return errorResponse(res, 403, 'Access denied!');
    }

    // responses lo with questions
    const responses = await Response.find({ attemptId: req.params.attemptId })
      .populate('questionId');

    // insights generate karo
    const questions = responses.map(r => r.questionId);
    const insights = generateInsights(responses, questions);

    return successResponse(res, 200, 'Result fetched!', {
      attempt,
      responses,
      insights,
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── CHECK ATTEMPT ──
exports.checkAttempt = async (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.user.userId;

    const attempt = await Attempt.findOne({
      userId,
      testId,
      status: 'completed',
    });

    return successResponse(res, 200, 'Attempt check!', {
      attempted: !!attempt,
      attemptId: attempt ? attempt._id : null,
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};