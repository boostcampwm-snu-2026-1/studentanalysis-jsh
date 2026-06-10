import * as repo from '../repositories/consultationRepository'
import { AppError } from '../types'
import { IConsultation } from '../models/Consultation'

interface CreateConsultationBody {
  studentId?: string
  consultedAt?: Date | string
  type?: IConsultation['type']
  content?: string
  analysisId?: string
  [key: string]: unknown
}

const getByStudentId = (studentId: string) => repo.findByStudentId(studentId)

const create = async (body: CreateConsultationBody) => {
  const { studentId, consultedAt, type, content } = body
  if (!studentId || !consultedAt || !type || !content)
    throw { status: 400, message: '필수 항목이 누락되었어요 (studentId, consultedAt, type, content)' } as AppError
  return repo.create(body as Partial<IConsultation>)
}

const update = async (id: string, data: Partial<IConsultation>) => {
  const consultation = await repo.update(id, data)
  if (!consultation) throw { status: 404, message: '상담 기록을 찾을 수 없어요' } as AppError
  return consultation
}

export { getByStudentId, create, update }
