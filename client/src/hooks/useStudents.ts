import { useState, useEffect } from 'react'
import client from '../api/client'

export interface Student {
  studentId: string
  name: string
  grade: number
  classNum: number
  number: number
  targetUniv: string
  targetMajor: string
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
