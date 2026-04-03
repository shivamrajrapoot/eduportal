// server/models/Response.js
const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attempt',
    required: true,
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },

  // User ka answer
  selectedAnswer: {
    type: String,
    default: null,  // null means skipped
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },

  // Status
  status: {
    type: String,
    enum: ['correct', 'incorrect', 'skipped', 'marked'],
    default: 'skipped',
  },
  markedForReview: {
    type: Boolean,
    default: false,
  },

  // Time
  timeTaken: {
    type: Number,  // seconds mein — is question pe kitna time lagaya
    default: 0,
  },

}, { timestamps: true });

module.exports = mongoose.model('Response', ResponseSchema);