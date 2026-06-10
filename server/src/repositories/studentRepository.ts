import Student, { IStudent } from '../models/student'

const findAll = (filter: Record<string, unknown> = {}) =>
  Student.find(filter).sort({ studentId: 1 })

const findById = (studentId: string) => Student.findOne({ studentId })

const create = (data: Partial<IStudent>) => Student.create(data)

const update = (studentId: string, data: Partial<IStudent>) =>
  Student.findOneAndUpdate({ studentId }, data, { new: true, runValidators: true })

const remove = (studentId: string) => Student.findOneAndDelete({ studentId })

export { findAll, findById, create, update, remove }
