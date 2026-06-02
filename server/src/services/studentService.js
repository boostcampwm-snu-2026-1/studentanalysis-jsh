const repo = require('../repositories/studentRepository')

const generateStudentId = (grade, classNum, number) =>
  String(grade).padStart(2, '0') +
  String(classNum).padStart(2, '0') +
  String(number).padStart(2, '0')

const validate = ({ name, grade, classNum, number }) => {
  if (!name || grade == null || classNum == null || number == null)
    throw { status: 400, message: '필수 항목이 누락되었어요 (name, grade, classNum, number)' }
  if (grade < 1 || grade > 9)
    throw { status: 400, message: 'grade는 1–9 사이여야 해요' }
  if (classNum < 1 || classNum > 10)
    throw { status: 400, message: 'classNum은 1–10 사이여야 해요' }
  if (number < 1 || number > 99)
    throw { status: 400, message: 'number는 1–99 사이여야 해요' }
}

const getAll = async ({ grade, classNum } = {}) => {
  const filter = {}
  if (grade != null) filter.grade = Number(grade)
  if (classNum != null) filter.classNum = Number(classNum)
  return repo.findAll(filter)
}

const calcAvgGrade = (subjects) => {
  if (!subjects || subjects.length === 0) return null
  const sum = subjects.reduce((acc, s) => acc + s.grade, 0)
  return Math.round((sum / subjects.length) * 10) / 10
}

const getById = async (studentId) => {
  const student = await repo.findById(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' }
  const obj = student.toObject()
  obj.grades = obj.grades.map((g) => ({ ...g, avgGrade: calcAvgGrade(g.subjects) }))
  return obj
}

const create = async (body) => {
  validate(body)
  const studentId = generateStudentId(body.grade, body.classNum, body.number)
  try {
    return await repo.create({ ...body, studentId })
  } catch (err) {
    if (err.code === 11000) throw { status: 400, message: '이미 등록된 학생이에요' }
    throw err
  }
}

const update = async (studentId, body) => {
  const student = await repo.update(studentId, body)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' }
  return student
}

const remove = async (studentId) => {
  const student = await repo.remove(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' }
}

module.exports = { getAll, getById, create, update, remove }
