// @ts-nocheck
const mongoose = require('mongoose')

const analysisSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    inputText: { type: String, required: true },
    result: {
      competencyProfile: { type: mongoose.Schema.Types.Mixed, default: null },
      diagnosis:         { type: mongoose.Schema.Types.Mixed, default: null },
      activityA:         { type: mongoose.Schema.Types.Mixed, default: null },
      activityB:         { type: mongoose.Schema.Types.Mixed, default: null },
      narrative:         { type: mongoose.Schema.Types.Mixed, default: null },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Analysis', analysisSchema)
