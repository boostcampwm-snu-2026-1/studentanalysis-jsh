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

const examSubjectSchema = new mongoose.Schema(
  { grade: { type: Number, min: 1, max: 9 }, percentile: { type: Number, min: 0, max: 100 } },
  { _id: false }
)

const engSchema = new mongoose.Schema(
  { grade: { type: Number, min: 1, max: 9 } },
  { _id: false }
)

const mockExamSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    kor: { type: examSubjectSchema, default: {} },
    math: { type: examSubjectSchema, default: {} },
    eng: { type: engSchema, default: {} },
    exp1: { type: examSubjectSchema, default: {} },
    exp2: { type: examSubjectSchema, default: {} },
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
    mockExams: { type: [mockExamSchema], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Student', studentSchema)
