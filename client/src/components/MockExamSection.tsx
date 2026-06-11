import { MockExam } from '../hooks/useStudents'

interface MockExamSubjectEntry {
  grade: string
  percentile: string
}

export interface MockExamEntry {
  year: string
  month: string
  kor: MockExamSubjectEntry
  math: MockExamSubjectEntry
  eng: { grade: string }
  exp1: MockExamSubjectEntry
  exp2: MockExamSubjectEntry
}

interface MockExamSectionProps {
  existingMockExams: MockExam[]
  value: MockExamEntry[]
  onChange: (v: MockExamEntry[]) => void
}

const SUBJECTS = [
  { key: 'kor', label: '국어', hasPercentile: true },
  { key: 'math', label: '수학', hasPercentile: true },
  { key: 'eng', label: '영어', hasPercentile: false },
  { key: 'exp1', label: '탐구1', hasPercentile: true },
  { key: 'exp2', label: '탐구2', hasPercentile: true },
] as const
type SubjectKey = (typeof SUBJECTS)[number]['key']

const labelClass = 'text-xs font-semibold tracking-wide text-on-surface-variant uppercase'
const selectClass = 'bg-transparent text-on-surface text-sm py-2 border-b border-outline outline-none cursor-pointer'
const inputClass = 'bg-transparent text-on-surface text-sm py-2 border-b border-outline outline-none w-full'

const emptyEntry = (): MockExamEntry => ({
  year: String(new Date().getFullYear()),
  month: '1',
  kor: { grade: '', percentile: '' },
  math: { grade: '', percentile: '' },
  eng: { grade: '' },
  exp1: { grade: '', percentile: '' },
  exp2: { grade: '', percentile: '' },
})

const fromExisting = (e: MockExam): MockExamEntry => ({
  year: String(e.year),
  month: String(e.month),
  kor: { grade: String(e.kor?.grade ?? ''), percentile: String(e.kor?.percentile ?? '') },
  math: { grade: String(e.math?.grade ?? ''), percentile: String(e.math?.percentile ?? '') },
  eng: { grade: String(e.eng?.grade ?? '') },
  exp1: { grade: String(e.exp1?.grade ?? ''), percentile: String(e.exp1?.percentile ?? '') },
  exp2: { grade: String(e.exp2?.grade ?? ''), percentile: String(e.exp2?.percentile ?? '') },
})

export default function MockExamSection({ existingMockExams, value, onChange }: MockExamSectionProps) {
  const updateEntry = (i: number, entry: MockExamEntry) =>
    onChange(value.map((e, idx) => (idx === i ? entry : e)))

  const removeEntry = (i: number) =>
    onChange(value.filter((_, idx) => idx !== i))

  const handleYearChange = (i: number, newYear: string) => {
    const existing = existingMockExams.find(
      e => String(e.year) === newYear && String(e.month) === value[i].month
    )
    updateEntry(i, existing ? fromExisting(existing) : { ...emptyEntry(), year: newYear, month: value[i].month })
  }

  const handleMonthChange = (i: number, newMonth: string) => {
    const existing = existingMockExams.find(
      e => String(e.year) === value[i].year && String(e.month) === newMonth
    )
    updateEntry(i, existing ? fromExisting(existing) : { ...emptyEntry(), year: value[i].year, month: newMonth })
  }

  const updateSubjectField = (
    i: number,
    key: SubjectKey,
    field: 'grade' | 'percentile',
    val: string
  ) => {
    const entry = value[i]
    if (key === 'eng') {
      updateEntry(i, { ...entry, eng: { grade: val } })
    } else {
      updateEntry(i, { ...entry, [key]: { ...(entry[key] as MockExamSubjectEntry), [field]: val } })
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {value.map((entry, i) => (
        <div key={i} className="rounded border border-outline-variant p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-end">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>연도</label>
                <input
                  type="number"
                  value={entry.year}
                  onChange={e => handleYearChange(i, e.target.value)}
                  className={`${inputClass} w-20`}
                  placeholder="2024"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>월</label>
                <select
                  value={entry.month}
                  onChange={e => handleMonthChange(i, e.target.value)}
                  className={selectClass}
                >
                  {Array.from({ length: 12 }, (_, k) => k + 1).map(m => (
                    <option key={m} value={m}>{m}월</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeEntry(i)}
              className="text-xs text-on-surface-variant hover:text-error transition-colors"
            >
              시험 삭제
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[4rem_1fr_1fr] gap-3">
              <span className={labelClass}>영역</span>
              <span className={labelClass}>등급</span>
              <span className={labelClass}>백분위</span>
            </div>
            {SUBJECTS.map(({ key, label, hasPercentile }) => {
              const subj = entry[key] as MockExamSubjectEntry
              return (
                <div key={key} className="grid grid-cols-[4rem_1fr_1fr] gap-3 items-center">
                  <span className="text-sm text-on-surface">{label}</span>
                  <select
                    value={subj.grade}
                    onChange={e => updateSubjectField(i, key, 'grade', e.target.value)}
                    className={selectClass}
                  >
                    <option value="">등급</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(g => (
                      <option key={g} value={g}>{g}등급</option>
                    ))}
                  </select>
                  {hasPercentile ? (
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={(subj as MockExamSubjectEntry).percentile}
                      onChange={e => updateSubjectField(i, key, 'percentile', e.target.value)}
                      className={inputClass}
                      placeholder="백분위"
                    />
                  ) : (
                    <span className="text-xs text-on-surface-variant">해당 없음</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, emptyEntry()])}
        className="text-sm text-primary hover:opacity-80 transition-opacity text-left"
      >
        + 시험 추가
      </button>
    </div>
  )
}
