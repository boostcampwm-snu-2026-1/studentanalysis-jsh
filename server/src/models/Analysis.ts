import mongoose, { Schema, Document } from 'mongoose'

export interface IAnalysisResult {
  competencyProfile: unknown
  diagnosis: unknown
  activityA: unknown
  activityB: unknown
  narrative: unknown
}

export interface IAnalysis extends Document {
  studentId: string
  inputText: string
  result: IAnalysisResult
  createdAt: Date
  updatedAt: Date
}

const analysisSchema = new Schema<IAnalysis>(
  {
    studentId: { type: String, required: true },
    inputText: { type: String, required: true },
    result: {
      competencyProfile: { type: Schema.Types.Mixed, default: null },
      diagnosis: { type: Schema.Types.Mixed, default: null },
      activityA: { type: Schema.Types.Mixed, default: null },
      activityB: { type: Schema.Types.Mixed, default: null },
      narrative: { type: Schema.Types.Mixed, default: null },
    },
  },
  { timestamps: true }
)

export default mongoose.model<IAnalysis>('Analysis', analysisSchema)
