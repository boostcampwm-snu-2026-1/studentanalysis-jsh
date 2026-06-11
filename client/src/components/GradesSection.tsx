import { Grade } from '../hooks/useStudents'

export interface GradeEntry {
  year: number
  semester: number
  subjects: { name: string; grade: string }[]
}

const SUBJECTS = [
  '국어', '문학', '독서', '화법과작문', '언어와매체',
  '수학', '수학I', '수학II', '미적분', '확률과통계', '기하',
  '영어', '영어I', '영어II',
  '한국사', '통합사회', '생활과윤리', '윤리와사상', '한국지리', '세계지리',
  '동아시아사', '세계사', '경제', '정치와법', '사회문화',
  '통합과학', '물리학I', '화학I', '생명과학I', '지구과학I',
  '물리학II', '화학II', '생명과학II', '지구과학II',
  '체육', '음악', '미술', '기술가정', '정보',
]

interface GradesSectionProps {
  existingGrades: Grade[]
  value: GradeEntry[]
  onChange: (v: GradeEntry[]) => void
}

const labelClass = 'text-xs font-semibold tracking-wide text-on-surface-variant uppercase'
const selectClass = 'bg-transparent text-on-surface text-sm py-2 border-b border-outline outline-none cursor-pointer'

export default function GradesSection({ existingGrades, value, onChange }: GradesSectionProps) {
  const updateEntry = (i: number, entry: GradeEntry) =>
    onChange(value.map((e, idx) => (idx === i ? entry : e)))

  const removeEntry = (i: number) =>
    onChange(value.filter((_, idx) => idx !== i))

  const addEntry = () =>
    onChange([...value, { year: 1, semester: 1, subjects: [] }])

  const handleYearChange = (i: number, newYear: number) => {
    const existing = existingGrades.find(g => g.year === newYear && g.semester === value[i].semester)
    updateEntry(i, {
      year: newYear,
      semester: value[i].semester,
      subjects: existing ? existing.subjects.map(s => ({ name: s.name, grade: String(s.grade) })) : [],
    })
  }

  const handleSemesterChange = (i: number, newSemester: number) => {
    const existing = existingGrades.find(g => g.year === value[i].year && g.semester === newSemester)
    updateEntry(i, {
      year: value[i].year,
      semester: newSemester,
      subjects: existing ? existing.subjects.map(s => ({ name: s.name, grade: String(s.grade) })) : [],
    })
  }

  const addRow = (i: number) =>
    updateEntry(i, { ...value[i], subjects: [...value[i].subjects, { name: '', grade: '' }] })

  const removeRow = (i: number, j: number) =>
    updateEntry(i, { ...value[i], subjects: value[i].subjects.filter((_, idx) => idx !== j) })

  const updateRow = (i: number, j: number, field: 'name' | 'grade', val: string) =>
    updateEntry(i, {
      ...value[i],
      subjects: value[i].subjects.map((s, idx) => (idx === j ? { ...s, [field]: val } : s)),
    })

  return (
    <div className="flex flex-col gap-3">
      {value.map((entry, i) => (
        <div key={i} className="rounded border border-outline-variant p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>학년</label>
                <select
                  value={entry.year}
                  onChange={e => handleYearChange(i, Number(e.target.value))}
                  className={selectClass}
                >
                  {[1, 2, 3].map(y => <option key={y} value={y}>{y}학년</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>학기</label>
                <select
                  value={entry.semester}
                  onChange={e => handleSemesterChange(i, Number(e.target.value))}
                  className={selectClass}
                >
                  {[1, 2].map(s => <option key={s} value={s}>{s}학기</option>)}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeEntry(i)}
              className="text-xs text-on-surface-variant hover:text-error transition-colors"
            >
              학기 삭제
            </button>
          </div>

          {entry.subjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <span className={`${labelClass} flex-1`}>과목명</span>
                <span className={`${labelClass} w-16`}>등급</span>
                <span className="w-5" />
              </div>
              {entry.subjects.map((subj, j) => (
                <div key={j} className="flex gap-3 items-center">
                  <select
                    value={subj.name}
                    onChange={e => updateRow(i, j, 'name', e.target.value)}
                    className={`${selectClass} flex-1`}
                  >
                    <option value="">과목 선택</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select
                    value={subj.grade}
                    onChange={e => updateRow(i, j, 'grade', e.target.value)}
                    className={`${selectClass} w-16`}
                  >
                    <option value="">등급</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => (
                      <option key={g} value={g}>{g}등급</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeRow(i, j)}
                    className="text-sm text-on-surface-variant hover:text-error transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => addRow(i)}
            className="text-sm text-primary hover:opacity-80 transition-opacity text-left"
          >
            + 과목 추가
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addEntry}
        className="text-sm text-primary hover:opacity-80 transition-opacity text-left"
      >
        + 학기 추가
      </button>
    </div>
  )
}
