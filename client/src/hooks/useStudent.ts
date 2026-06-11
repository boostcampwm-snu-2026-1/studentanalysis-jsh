import { useState, useEffect, useCallback } from 'react'
import client from '../api/client'
import { Student } from './useStudents'

interface UseStudentResult {
  student: Student | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export default function useStudent(studentId: string): UseStudentResult {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    setLoading(true)
    client
      .get(`/api/students/${studentId}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => setStudent(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [studentId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { student, loading, error, refetch }
}
