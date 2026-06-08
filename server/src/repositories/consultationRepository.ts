import Consultation, { IConsultation } from '../models/Consultation'

const create = (data: Partial<IConsultation>) => Consultation.create(data)

const findByStudentId = (studentId: string) =>
  Consultation.find({ studentId }).sort({ consultedAt: -1 })

const update = (id: string, data: Partial<IConsultation>) =>
  Consultation.findByIdAndUpdate(id, data, { new: true, runValidators: true })

export { create, findByStudentId, update }
