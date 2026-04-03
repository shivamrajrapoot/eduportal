// server/models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    {
      label: { type: String, required: true }, // A, B, C, D
      text:  { type: String, required: true }, // option ka content
    }
  ],
  correctAnswer: {
    type: String,  // 'A', 'B', 'C', ya 'D'
    required: true,
  },
  explanation: {
    type: String,
    default: '',   // answer ka explanation — result mein dikhega
  },
  marks: {
    type: Number,
    default: 1,    // is question ke kitne marks hain
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  order: {
    type: Number,  // test mein question ka number
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);