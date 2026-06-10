import mongoose, { Schema, Document, Types } from 'mongoose'

export type ConsultationType = '진로' | '학업' | '심리' | '교우' | '가정' | '기타'

export interface IConsultation extends Document {
  studentId: string
  analysisId?: Types.ObjectId
  consultedAt: Date
  type: ConsultationType
  content: string
}

const consultationSchema = new Schema<IConsultation>(
  {
    studentId: { type: String, required: true },
    analysisId: { type: Schema.Types.ObjectId, ref: 'Analysis' },
    consultedAt: { type: Date, required: true },
    type: { type: String, enum: ['진로', '학업', '심리', '교우', '가정', '기타'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model<IConsultation>('Consultation', consultationSchema)
