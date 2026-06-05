const repo = require('../repositories/consultationRepository')

const getByStudentId = (studentId) => repo.findByStudentId(studentId)

const create = async (body) => {
  const { studentId, consultedAt, type, content } = body
  if (!studentId || !consultedAt || !type || !content)
    throw { status: 400, message: '필수 항목이 누락되었어요 (studentId, consultedAt, type, content)' }
  return repo.create(body)
}

const update = async (id, data) => {
  const consultation = await repo.update(id, data)
  if (!consultation) throw { status: 404, message: '상담 기록을 찾을 수 없어요' }
  return consultation
}

module.exports = { getByStudentId, create, update }
