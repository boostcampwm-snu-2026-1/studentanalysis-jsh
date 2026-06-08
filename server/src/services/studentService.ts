// @ts-nocheck
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

const upsertGrades = async (studentId, { year, semester, subjects }) => {
  if (year == null || semester == null)
    throw { status: 400, message: '필수 항목이 누락되었어요 (year, semester)' }
  const student = await repo.findById(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' }
  const idx = student.grades.findIndex((g) => g.year === year && g.semester === semester)
  if (idx >= 0) student.grades[idx] = { year, semester, subjects: subjects || [] }
  else student.grades.push({ year, semester, subjects: subjects || [] })
  await student.save()
  return getById(studentId)
}

const upsertMockExam = async (studentId, { year, month, kor, math, eng, exp1, exp2 }) => {
  if (year == null || month == null)
    throw { status: 400, message: '필수 항목이 누락되었어요 (year, month)' }
  const student = await repo.findById(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' }
  const idx = student.mockExams.findIndex((e) => e.year === year && e.month === month)
  const exam = { year, month, kor: kor || {}, math: math || {}, eng: eng || {}, exp1: exp1 || {}, exp2: exp2 || {} }
  if (idx >= 0) student.mockExams[idx] = exam
  else student.mockExams.push(exam)
  await student.save()
  return getById(studentId)
}

module.exports = { getAll, getById, create, update, remove, upsertGrades, upsertMockExam }
