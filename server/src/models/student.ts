import mongoose, { Schema, Document } from 'mongoose'
import { ISubject, IGrade, IExamSubject, IEngSubject, IMockExam } from '../types'

export interface IStudent extends Document {
  studentId: string
  name: string
  grade: number
  classNum: number
  number: number
  targetUniv: string
  targetMajor: string
  grades: IGrade[]
  mockExams: IMockExam[]
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    grade: { type: Number, required: true, min: 1, max: 9 },
  },
  { _id: false }
)

const gradeSchema = new Schema<IGrade>(
  {
    year: { type: Number, required: true },
    semester: { type: Number, required: true, min: 1, max: 2 },
    subjects: { type: [subjectSchema], default: [] },
  },
  { _id: false }
)

const examSubjectSchema = new Schema<IExamSubject>(
  { grade: { type: Number, min: 1, max: 9 }, percentile: { type: Number, min: 0, max: 100 } },
  { _id: false }
)

const engSchema = new Schema<IEngSubject>(
  { grade: { type: Number, min: 1, max: 9 } },
  { _id: false }
)

const mockExamSchema = new Schema<IMockExam>(
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

const studentSchema = new Schema<IStudent>(
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

export default mongoose.model<IStudent>('Student', studentSchema)
