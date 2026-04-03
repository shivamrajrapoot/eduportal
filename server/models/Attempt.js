// server/models/Attempt.js
const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  isFirstAttempt: {
    type: Boolean,
    default: true,  // pehli baar DB mein save — reattempt nahi
  },

  // Score fields
  score: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  correct: {
    type: Number,
    default: 0,
  },
  incorrect: {
    type: Number,
    default: 0,
  },
  skipped: {
    type: Number,
    default: 0,
  },
  markedForReview: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 0,  // percentage
  },

  // Time fields
  timeTaken: {
    type: Number,  // seconds mein — poore test ka
    default: 0,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    default: null,
  },

  // Status
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'in-progress',
  },

}, { timestamps: true });

// Ek user ek test ek baar hi de sakta hai — first attempt
AttemptSchema.index({ userId: 1, testId: 1 }, { unique: true });

module.exports = mongoose.model('Attempt', AttemptSchema);