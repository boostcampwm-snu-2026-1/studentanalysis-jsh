import { useState, useEffect } from 'react'
import client from '../api/client'

export interface GradeSubject {
  name: string
  grade: number
}

export interface Grade {
  year: number
  semester: number
  subjects: GradeSubject[]
  avgGrade?: number
}

export interface MockExamSubject {
  grade?: number
  percentile?: number
}

export interface MockExam {
  year: number
  month: number
  kor: MockExamSubject
  math: MockExamSubject
  eng: { grade?: number }
  exp1: MockExamSubject
  exp2: MockExamSubject
}

export interface Student {
  studentId: string
  name: string
  grade: number
  classNum: number
  number: number
  targetUniv: string
  targetMajor: string
  grades: Grade[]
  mockExams: MockExam[]
}

interface UseStudentsResult {
  students: Student[]
  loading: boolean
  error: string | null
}

export default function useStudents(): UseStudentsResult {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    client.get('/api/students')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => setStudents(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { students, loading, error }
}
