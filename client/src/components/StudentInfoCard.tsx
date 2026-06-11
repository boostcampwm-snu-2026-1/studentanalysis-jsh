import Button from './Button'
import GradesTable from './GradesTable'
import MockExamsTable from './MockExamsTable'
import { Student } from '../hooks/useStudents'

interface Props {
  student: Student
  onEditClick: () => void
}

export default function StudentInfoCard({ student, onEditClick }: Props) {
  const gradesAvg = (() => {
    const avgs = student.grades?.map(g => g.avgGrade).filter((v): v is number => v != null) ?? []
    if (avgs.length === 0) return '—'
    return (Math.round((avgs.reduce((a, b) => a + b, 0) / avgs.length) * 10) / 10).toFixed(1) + '등급'
  })()

  const mockAvg = (() => {
    const exams = student.mockExams ?? []
    if (exams.length === 0) return '—'
    const latest = [...exams].sort((a, b) => b.year - a.year || b.month - a.month)[0]
    const grades = [latest.kor?.grade, latest.math?.grade, latest.eng?.grade, latest.exp1?.grade, latest.exp2?.grade]
      .filter((v): v is number => v != null)
    if (grades.length === 0) return '—'
    return (Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10).toFixed(1) + '등급'
  })()

  const infoRows = [
    { label: '이름', value: student.name },
    { label: '학년', value: `${student.grade}학년` },
    { label: '반', value: `${student.classNum}반` },
    { label: '번호', value: `${student.number}번` },
    { label: '목표 대학', value: student.targetUniv || '—' },
    { label: '목표 계열', value: student.targetMajor || '—' },
    { label: '내신 평균', value: gradesAvg },
    { label: '모의고사 평균 (최근)', value: mockAvg },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-on-surface">인적 사항</h3>
          <Button variant="secondary" onClick={onEditClick}>수정하기</Button>
        </div>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
          {infoRows.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-on-surface-variant">{label}</dt>
              <dd className="mt-1 text-sm text-on-surface">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {(student.grades?.length || student.mockExams?.length) ? (
        <div className="grid grid-cols-2 gap-6 items-stretch">
          {student.grades?.length ? <GradesTable grades={student.grades} /> : null}
          {student.mockExams?.length ? <MockExamsTable mockExams={student.mockExams} /> : null}
        </div>
      ) : null}
    </div>
  )
}
