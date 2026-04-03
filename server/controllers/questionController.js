// server/controllers/questionController.js
const Question = require('../models/Question');
const Test = require('../models/Test');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// ── ADD QUESTION ──
exports.addQuestion = async (req, res) => {
  try {
    const { testId, questionText, options, correctAnswer, explanation, marks, difficulty, order } = req.body;

    // test exist karta hai?
    const test = await Test.findById(testId);
    if (!test) return errorResponse(res, 404, 'Test nahi mila!');

    const question = await Question.create({
      testId,
      questionText,
      options,
      correctAnswer,
      explanation,
      marks,
      difficulty,
      order,
    });

    return successResponse(res, 201, 'Question add ho gaya!', { question });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── GET ALL QUESTIONS OF A TEST ──
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ testId: req.params.testId })
      .sort({ order: 1 });

    return successResponse(res, 200, 'Questions fetched!', { questions });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── UPDATE QUESTION ──
exports.updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!question) return errorResponse(res, 404, 'Question nahi mila!');

    return successResponse(res, 200, 'Question updated!', { question });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── DELETE QUESTION ──
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return errorResponse(res, 404, 'Question nahi mila!');

    return successResponse(res, 200, 'Question deleted!');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── UPDATE QUESTION — auto recalculate if answer changed ──
exports.updateQuestion = async (req, res) => {
  try {
    const oldQuestion = await Question.findById(req.params.id);
    if (!oldQuestion) return errorResponse(res, 404, 'Question nahi mila!');

    const answerChanged = req.body.correctAnswer &&
      req.body.correctAnswer !== oldQuestion.correctAnswer;

    // question update karo
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // agar answer change hua toh recalculate karo
    if (answerChanged) {
      await recalculateScores(question._id, req.body.correctAnswer, question.marks);
    }

    return successResponse(res, 200, 'Question updated!', {
      question,
      recalculated: answerChanged,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// ── HELPER — Score Recalculate ──
const recalculateScores = async (questionId, newCorrectAnswer, marks) => {
  const Response = require('../models/Response');
  const Attempt = require('../models/Attempt');
  const Test = require('../models/Test');

  // is question ke saare responses
  const responses = await Response.find({ questionId });

  for (const response of responses) {
    const wasCorrect = response.isCorrect;
    const isNowCorrect = response.selectedAnswer === newCorrectAnswer;

    if (wasCorrect === isNowCorrect) continue; // koi change nahi

    // response update karo
    response.isCorrect = isNowCorrect;
    response.status = response.selectedAnswer === null
      ? 'skipped'
      : isNowCorrect ? 'correct' : 'incorrect';
    await response.save();

    // attempt update karo
    const attempt = await Attempt.findById(response.attemptId);
    if (!attempt) continue;

    const test = await Test.findById(attempt.testId);
    const negativeMarking = test?.negativeMarking || 0;

    if (isNowCorrect && !wasCorrect) {
      // galat tha — ab sahi hai
      attempt.correct += 1;
      attempt.incorrect -= 1;
      attempt.score += marks + (negativeMarking * marks);
    } else if (!isNowCorrect && wasCorrect) {
      // sahi tha — ab galat hai
      attempt.correct -= 1;
      attempt.incorrect += 1;
      attempt.score -= marks + (negativeMarking * marks);
    }

    // score kabhi negative nahi hoga
    attempt.score = Math.max(0, attempt.score);

    // accuracy recalculate
    const attempted = attempt.correct + attempt.incorrect;
    attempt.accuracy = attempted > 0
      ? Math.round((attempt.correct / attempted) * 100)
      : 0;

    await attempt.save();
  }
};