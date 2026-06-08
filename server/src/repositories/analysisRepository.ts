import Analysis, { IAnalysis } from '../models/Analysis'

const create = (data: Partial<IAnalysis>) => Analysis.create(data)

const findByStudentId = (studentId: string) =>
  Analysis.find({ studentId }).sort({ createdAt: -1 })

const findById = (id: string) => Analysis.findById(id)

export { create, findByStudentId, findById }
