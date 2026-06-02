const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema(
  { 
    name: { type: String, required: true }, 
    grade: { type: Number, required: true, min: 1, max: 9 } 
  },
  { _id: false }
)

const gradeSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    semester: { type: Number, required: true, min: 1, max: 2 },
    subjects: { type: [subjectSchema], default: [] },
  },
  { _id: false }
)

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    grade: { type: Number, required: true, min: 1, max: 9 },
    classNum: { type: Number, required: true, min: 1, max: 10 },
    number: { type: Number, required: true, min: 1, max: 99 },
    targetUniv: { type: String, default: '' },
    targetMajor: { type: String, default: '' },
    grades: { type: [gradeSchema], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Student', studentSchema)
