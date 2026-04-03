// server/models/CourseTeacher.js
const mongoose = require('mongoose');

const CourseTeacherSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Ek teacher ek course mein sirf ek baar assign ho sakta hai
CourseTeacherSchema.index({ courseId: 1, teacherId: 1 }, { unique: true });

module.exports = mongoose.model('CourseTeacher', CourseTeacherSchema);