const mongoose = require('mongoose')

const consultationSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    analysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis' },
    consultedAt: { type: Date, required: true },
    type: { type: String, enum: ['진로', '학업', '심리', '교우', '가정', '기타'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Consultation', consultationSchema)
