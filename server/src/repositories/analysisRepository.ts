import Analysis, { IAnalysis } from '../models/Analysis'

const create = (data: Partial<IAnalysis>) => Analysis.create(data)

const init = (studentId: string, inputText: string) =>
  Analysis.create({
    studentId,
    inputText,
    result: { competencyProfile: null, diagnosis: null, activityA: null, activityB: null, narrative: null },
  })

const updateStep = (id: string, step: string, value: unknown) =>
  Analysis.findByIdAndUpdate(
    id,
    { $set: { [`result.${step}`]: value } },
    { new: true, runValidators: true }
  )

const findByStudentId = (studentId: string) =>
  Analysis.find({ studentId }).sort({ createdAt: -1 })

const findById = (id: string) => Analysis.findById(id)

export { create, init, updateStep, findByStudentId, findById }
