const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    grade: { type: Number, required: true, min: 1, max: 9 },
    classNum: { type: Number, required: true, min: 1, max: 10 },
    number: { type: Number, required: true, min: 1, max: 99 },
    targetUniv: { type: String, default: '' },
    targetMajor: { type: String, default: '' },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Student', studentSchema)
