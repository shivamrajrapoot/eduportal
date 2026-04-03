// server/models/Test.js
const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  duration: {
    type: Number,  // minutes mein
    required: true,
  },
  totalMarks: {
    type: Number,
    required: true,
  },
  passingMarks: {
    type: Number,
    default: 0,
  },
  negativeMarking: {
    type: Number,
    default: 0,  // 0.25 means -0.25 per wrong answer
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,  // admin publish kare tab hi users dekh sakte
  },
}, { timestamps: true });



module.exports = mongoose.model('Test', TestSchema);