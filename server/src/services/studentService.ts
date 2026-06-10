import * as repo from '../repositories/studentRepository'
import { AppError, ISubject, IGrade, IMockExam } from '../types'

interface StudentQuery {
  grade?: string | number
  classNum?: string | number
}

interface CreateStudentBody {
  name: string
  grade: number
  classNum: number
  number: number
  targetUniv?: string
  targetMajor?: string
}

interface GradeBody {
  year?: number
  semester?: number
  subjects?: ISubject[]
}

interface MockExamBody {
  year?: number
  month?: number
  kor?: IMockExam['kor']
  math?: IMockExam['math']
  eng?: IMockExam['eng']
  exp1?: IMockExam['exp1']
  exp2?: IMockExam['exp2']
}

const generateStudentId = (grade: number, classNum: number, number: number): string =>
  String(grade).padStart(2, '0') +
  String(classNum).padStart(2, '0') +
  String(number).padStart(2, '0')

const validate = ({ name, grade, classNum, number }: Partial<CreateStudentBody>): void => {
  if (!name || grade == null || classNum == null || number == null)
    throw { status: 400, message: '필수 항목이 누락되었어요 (name, grade, classNum, number)' } as AppError
  if (grade < 1 || grade > 9)
    throw { status: 400, message: 'grade는 1–9 사이여야 해요' } as AppError
  if (classNum < 1 || classNum > 10)
    throw { status: 400, message: 'classNum은 1–10 사이여야 해요' } as AppError
  if (number < 1 || number > 99)
    throw { status: 400, message: 'number는 1–99 사이여야 해요' } as AppError
}

const getAll = async ({ grade, classNum }: StudentQuery = {}) => {
  const filter: Record<string, number> = {}
  if (grade != null) filter.grade = Number(grade)
  if (classNum != null) filter.classNum = Number(classNum)
  return repo.findAll(filter)
}

const calcAvgGrade = (subjects: ISubject[]): number | null => {
  if (!subjects || subjects.length === 0) return null
  const sum = subjects.reduce((acc, s) => acc + s.grade, 0)
  return Math.round((sum / subjects.length) * 10) / 10
}

const getById = async (studentId: string) => {
  const student = await repo.findById(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' } as AppError
  const obj = student.toObject() as unknown as { grades: IGrade[]; [key: string]: unknown }
  obj.grades = obj.grades.map((g) => ({ ...g, avgGrade: calcAvgGrade(g.subjects) }))
  return obj
}

const create = async (body: CreateStudentBody) => {
  validate(body)
  const studentId = generateStudentId(body.grade, body.classNum, body.number)
  try {
    return await repo.create({ ...body, studentId })
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000)
      throw { status: 400, message: '이미 등록된 학생이에요' } as AppError
    throw err
  }
}

const update = async (studentId: string, body: Partial<CreateStudentBody>) => {
  const student = await repo.update(studentId, body)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' } as AppError
  return student
}

const remove = async (studentId: string): Promise<void> => {
  const student = await repo.remove(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' } as AppError
}

const upsertGrades = async (studentId: string, { year, semester, subjects }: GradeBody) => {
  if (year == null || semester == null)
    throw { status: 400, message: '필수 항목이 누락되었어요 (year, semester)' } as AppError
  const student = await repo.findById(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' } as AppError
  const idx = student.grades.findIndex((g) => g.year === year && g.semester === semester)
  const entry: IGrade = { year, semester, subjects: subjects || [] }
  if (idx >= 0) (student.grades as IGrade[])[idx] = entry
  else student.grades.push(entry as never)
  await student.save()
  return getById(studentId)
}

const upsertMockExam = async (studentId: string, { year, month, kor, math, eng, exp1, exp2 }: MockExamBody) => {
  if (year == null || month == null)
    throw { status: 400, message: '필수 항목이 누락되었어요 (year, month)' } as AppError
  const student = await repo.findById(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없어요' } as AppError
  const idx = student.mockExams.findIndex((e) => e.year === year && e.month === month)
  const exam: IMockExam = {
    year, month,
    kor: kor || {},
    math: math || {},
    eng: eng || {},
    exp1: exp1 || {},
    exp2: exp2 || {},
  }
  if (idx >= 0) (student.mockExams as IMockExam[])[idx] = exam
  else student.mockExams.push(exam as never)
  await student.save()
  return getById(studentId)
}

export { getAll, getById, create, update, remove, upsertGrades, upsertMockExam }
