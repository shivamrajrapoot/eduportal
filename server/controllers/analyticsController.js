// server/controllers/analyticsController.js
const Attempt = require('../models/Attempt');
const Response = require('../models/Response');
const Question = require('../models/Question');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ── USER ANALYTICS ──
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    // user ke saare completed attempts
    const attempts = await Attempt.find({ userId, status: 'completed' })
      .populate('testId', 'title totalMarks');

    if (attempts.length === 0) {
      return successResponse(res, 200, 'Koi attempt nahi mila!', { analytics: null });
    }

    // total stats calculate karo
    const totalAttempted = attempts.length;
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correct, 0);
    const totalIncorrect = attempts.reduce((sum, a) => sum + a.incorrect, 0);
    const totalSkipped = attempts.reduce((sum, a) => sum + a.skipped, 0);
    const totalMarked = attempts.reduce((sum, a) => sum + a.markedForReview, 0);
    const totalTimeTaken = attempts.reduce((sum, a) => sum + a.timeTaken, 0);

    const totalQuestions = totalCorrect + totalIncorrect + totalSkipped;
    const accuracy = totalQuestions > 0
      ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100)
      : 0;
    const attemptRate = totalQuestions > 0
      ? Math.round(((totalCorrect + totalIncorrect) / totalQuestions) * 100)
      : 0;

    return successResponse(res, 200, 'Analytics fetched!', {
      analytics: {
        totalAttempted,
        totalCorrect,
        totalIncorrect,
        totalSkipped,
        totalMarked,
        totalTimeTaken,
        accuracy,
        attemptRate,
        attempts, // test-wise breakdown
      }
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── QUESTION ANALYTICS (Global) ──
exports.getQuestionAnalytics = async (req, res) => {
  try {
    const { questionId } = req.params;

    // is question ke saare responses
    const responses = await Response.find({ questionId });

    if (responses.length === 0) {
      return successResponse(res, 200, 'Koi response nahi mila!', { analytics: null });
    }

    const total = responses.length;
    const correct = responses.filter(r => r.status === 'correct').length;
    const incorrect = responses.filter(r => r.status === 'incorrect').length;
    const skipped = responses.filter(r => r.status === 'skipped').length;
    const marked = responses.filter(r => r.markedForReview === true).length;

    return successResponse(res, 200, 'Question analytics fetched!', {
      analytics: {
        total,
        correctPercent: Math.round((correct / total) * 100),
        incorrectPercent: Math.round((incorrect / total) * 100),
        skippedPercent: Math.round((skipped / total) * 100),
        markedPercent: Math.round((marked / total) * 100),
      }
    });

  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};