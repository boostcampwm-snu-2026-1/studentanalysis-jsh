import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import GradesSection, { GradeEntry } from './GradesSection'
import MockExamSection, { MockExamEntry } from './MockExamSection'
import StudentInfoCard from './StudentInfoCard'
import client from '../api/client'
import { Student } from '../hooks/useStudents'

interface EditForm {
  name: string
  grade: string
  classNum: string
  number: string
  targetUniv: string
  targetMajor: string
}

interface Props {
  studentId: string
  student: Student | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export default function BasicInfoTab({ studentId, student, loading, error, refetch }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [form, setForm] = useState<EditForm>({ name: '', grade: '', classNum: '', number: '', targetUniv: '', targetMajor: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [gradesEntries, setGradesEntries] = useState<GradeEntry[]>([])
  const [mockExamEntries, setMockExamEntries] = useState<MockExamEntry[]>([])

  const handleOpenEdit = () => {
    if (!student) return
    setForm({
      name: student.name,
      grade: String(student.grade),
      classNum: String(student.classNum),
      number: String(student.number),
      targetUniv: student.targetUniv ?? '',
      targetMajor: student.targetMajor ?? '',
    })
    setGradesEntries(
      student.grades?.map(g => ({
        year: g.year,
        semester: g.semester,
        subjects: g.subjects.map(s => ({ name: s.name, grade: String(s.grade) })),
      })) ?? []
    )
    setMockExamEntries(
      student.mockExams?.map(e => ({
        year: String(e.year),
        month: String(e.month),
        kor: { grade: String(e.kor?.grade ?? ''), percentile: String(e.kor?.percentile ?? '') },
        math: { grade: String(e.math?.grade ?? ''), percentile: String(e.math?.percentile ?? '') },
        eng: { grade: String(e.eng?.grade ?? '') },
        exp1: { grade: String(e.exp1?.grade ?? ''), percentile: String(e.exp1?.percentile ?? '') },
        exp2: { grade: String(e.exp2?.grade ?? ''), percentile: String(e.exp2?.percentile ?? '') },
      })) ?? []
    )
    setSaveError(null)
    setIsEditOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      await client.put(`/api/students/${studentId}`, {
        name: form.name,
        grade: Number(form.grade),
        classNum: Number(form.classNum),
        number: Number(form.number),
        targetUniv: form.targetUniv,
        targetMajor: form.targetMajor,
      })
      for (const entry of gradesEntries) {
        const validSubjects = entry.subjects.filter(s => s.name.trim())
        if (validSubjects.length > 0) {
          await client.put(`/api/students/${studentId}/grades`, {
            year: entry.year,
            semester: entry.semester,
            subjects: validSubjects.map(s => ({ name: s.name.trim(), grade: Number(s.grade) })),
          })
        }
      }
      for (const entry of mockExamEntries) {
        if (!entry.year || !entry.month) continue
        const toNum = (v: string) => (v !== '' ? Number(v) : undefined)
        await client.put(`/api/students/${studentId}/mock-exams`, {
          year: Number(entry.year),
          month: Number(entry.month),
          kor: { grade: toNum(entry.kor.grade), percentile: toNum(entry.kor.percentile) },
          math: { grade: toNum(entry.math.grade), percentile: toNum(entry.math.percentile) },
          eng: { grade: toNum(entry.eng.grade) },
          exp1: { grade: toNum(entry.exp1.grade), percentile: toNum(entry.exp1.percentile) },
          exp2: { grade: toNum(entry.exp2.grade), percentile: toNum(entry.exp2.percentile) },
        })
      }
      setIsEditOpen(false)
      refetch()
    } catch (err) {
      setSaveError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const setField = (field: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-6 w-full rounded bg-surface-container-high animate-pulse" />
      ))}
    </div>
  )

  if (error) return <p className="text-sm text-error">{error}</p>

  return (
    <>
      <StudentInfoCard student={student!} onEditClick={handleOpenEdit} />

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="학생 정보 수정">
        <div className="flex flex-col gap-5">
          <Input label="이름" value={form.name} onChange={setField('name')} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="학년" type="number" value={form.grade} onChange={setField('grade')} />
            <Input label="반" type="number" value={form.classNum} onChange={setField('classNum')} />
            <Input label="번호" type="number" value={form.number} onChange={setField('number')} />
          </div>
          <Input label="목표 대학" value={form.targetUniv} onChange={setField('targetUniv')} />
          <Input label="목표 계열" value={form.targetMajor} onChange={setField('targetMajor')} />
          <hr className="border-outline-variant" />
          <div>
            <p className="text-sm font-semibold text-on-surface mb-4">내신 수정</p>
            <GradesSection
              existingGrades={student?.grades ?? []}
              value={gradesEntries}
              onChange={setGradesEntries}
            />
          </div>
          <hr className="border-outline-variant" />
          <div>
            <p className="text-sm font-semibold text-on-surface mb-4">모의고사 수정</p>
            <MockExamSection
              existingMockExams={student?.mockExams ?? []}
              value={mockExamEntries}
              onChange={setMockExamEntries}
            />
          </div>
          {saveError && <p className="text-xs text-error">{saveError}</p>}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
