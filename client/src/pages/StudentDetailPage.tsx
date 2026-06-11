import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Tabs from '../components/Tabs'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Input from '../components/Input'
import GradesSection, { GradeEntry } from '../components/GradesSection'
import MockExamSection, { MockExamEntry } from '../components/MockExamSection'
import useStudent from '../hooks/useStudent'
import client from '../api/client'

const TAB_KEYS = ['basic', 'analysis', 'consultation', 'university'] as const
type TabKey = (typeof TAB_KEYS)[number]

const TAB_LABELS: Record<TabKey, string> = {
  basic: '기본 정보',
  analysis: '생기부 분석',
  consultation: '상담 기록',
  university: '대학 탐색',
}

const ANALYSIS_STEPS = ['역량 프로필', '종합 진단', '활동 추천 A', '활동 추천 B', '서사 설계'] as const

interface Analysis {
  _id: string
  inputText: string
  result: {
    competencyProfile: unknown
    diagnosis: unknown
    activityA: unknown
    activityB: unknown
    narrative: unknown
  }
  createdAt: string
}

interface EditForm {
  name: string
  grade: string
  classNum: string
  number: string
  targetUniv: string
  targetMajor: string
}

export default function StudentDetailPage() {
  const { id: studentId } = useParams<{ id: string }>()
  const { student, loading, error, refetch } = useStudent(studentId!)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [form, setForm] = useState<EditForm>({ name: '', grade: '', classNum: '', number: '', targetUniv: '', targetMajor: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [gradesEntries, setGradesEntries] = useState<GradeEntry[]>([])
  const [mockExamEntries, setMockExamEntries] = useState<MockExamEntry[]>([])

  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([])
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisFetched, setAnalysisFetched] = useState(false)
  const [inputText, setInputText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [showInputArea, setShowInputArea] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const fetchAnalysis = useCallback(async () => {
    setAnalysisLoading(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await client.get(`/api/students/${studentId}/analysis`) as any
      setAnalysisHistory(res.data ?? [])
    } finally {
      setAnalysisLoading(false)
      setAnalysisFetched(true)
    }
  }, [studentId])

  const rawTab = searchParams.get('tab')
  const activeTab: TabKey = TAB_KEYS.includes(rawTab as TabKey) ? (rawTab as TabKey) : 'basic'

  useEffect(() => {
    if (activeTab === 'analysis' && !analysisFetched) fetchAnalysis()
  }, [activeTab, analysisFetched, fetchAnalysis])

  useEffect(() => {
    if (!analyzing) return
    setActiveStep(0)
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev))
    }, 3000)
    return () => clearInterval(interval)
  }, [analyzing])

  const handleTabChange = (key: string) => {
    navigate({ pathname, search: `?tab=${key}` }, { replace: true })
  }

  const handleAnalyze = async () => {
    if (!inputText.trim()) return
    setAnalyzing(true)
    setAnalyzeError(null)
    try {
      await client.post(`/api/students/${studentId}/analyze`, { inputText })
      setShowInputArea(false)
      setInputText('')
      setAnalysisFetched(false)
      await fetchAnalysis()
    } catch (err) {
      setAnalyzeError((err as Error).message)
    } finally {
      setAnalyzing(false)
    }
  }

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

  const gradesAvg = (() => {
    const avgs = student?.grades?.map(g => g.avgGrade).filter((v): v is number => v != null) ?? []
    if (avgs.length === 0) return '—'
    return (Math.round((avgs.reduce((a, b) => a + b, 0) / avgs.length) * 10) / 10).toFixed(1) + '등급'
  })()

  const mockAvg = (() => {
    const exams = student?.mockExams ?? []
    if (exams.length === 0) return '—'
    const latest = [...exams].sort((a, b) => b.year - a.year || b.month - a.month)[0]
    const grades = [latest.kor?.grade, latest.math?.grade, latest.eng?.grade, latest.exp1?.grade, latest.exp2?.grade]
      .filter((v): v is number => v != null)
    if (grades.length === 0) return '—'
    return (Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 10) / 10).toFixed(1) + '등급'
  })()

  const infoRows = student
    ? [
        { label: '이름', value: student.name },
        { label: '학년', value: `${student.grade}학년` },
        { label: '반', value: `${student.classNum}반` },
        { label: '번호', value: `${student.number}번` },
        { label: '목표 대학', value: student.targetUniv || '—' },
        { label: '목표 계열', value: student.targetMajor || '—' },
        { label: '내신 평균', value: gradesAvg },
        { label: '모의고사 평균 (최근)', value: mockAvg },
      ]
    : []

  const gradesTable = (() => {
    const grades = student?.grades
    if (!grades || grades.length === 0) return null
    const sorted = [...grades].sort((a, b) => a.year - b.year || a.semester - b.semester)
    const byYear = sorted.reduce<Record<number, typeof sorted>>((acc, g) => {
      ;(acc[g.year] ??= []).push(g)
      return acc
    }, {})
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 h-full">
        <h3 className="mb-6 text-sm font-semibold text-on-surface">내신 성적</h3>
        <div className="flex flex-col gap-6">
          {Object.entries(byYear).map(([year, entries]) => {
            const subjectCols = [...new Set(entries.flatMap(g => g.subjects.map(s => s.name)))]
            return (
              <div key={year}>
                <p className="mb-3 text-xs font-semibold text-on-surface-variant">{year}학년</p>
                <table className="w-full table-fixed text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="pb-3 pr-2 text-left text-xs font-semibold text-on-surface-variant w-12">학기</th>
                      {subjectCols.map(col => (
                        <th key={col} className="pb-3 px-1 text-center text-xs font-semibold text-on-surface-variant truncate">{col}</th>
                      ))}
                      <th className="pb-3 pl-1 text-center text-xs font-semibold text-on-surface-variant w-10">평균</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(g => {
                      const gradeMap = Object.fromEntries(g.subjects.map(s => [s.name, s.grade]))
                      return (
                        <tr key={g.semester} className="border-b border-outline-variant last:border-0">
                          <td className="py-3 pr-2 text-xs text-on-surface-variant">{g.semester}학기</td>
                          {subjectCols.map(col => (
                            <td key={col} className="py-3 px-1 text-center text-sm text-on-surface">
                              {gradeMap[col] != null ? gradeMap[col] : '—'}
                            </td>
                          ))}
                          <td className="py-3 pl-1 text-center text-sm font-semibold text-on-surface">
                            {g.avgGrade != null ? g.avgGrade : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </div>
    )
  })()

  const mockExamsTable = (() => {
    const exams = student?.mockExams
    if (!exams || exams.length === 0) return null
    const sorted = [...exams].sort((a, b) => b.year - a.year || b.month - a.month)
    const fmtSubject = (grade?: number, percentile?: number) => {
      if (grade == null) return '—'
      return percentile != null ? `${grade} (${percentile}%)` : `${grade}`
    }
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 h-full">
        <h3 className="mb-6 text-sm font-semibold text-on-surface">모의고사 성적</h3>
        <table className="w-full table-fixed text-sm">
          <thead>
            <tr className="border-b border-outline-variant">
              <th className="pb-3 pr-2 text-left text-xs font-semibold text-on-surface-variant w-16">시험</th>
              {['국어', '수학', '영어', '탐구1', '탐구2'].map(h => (
                <th key={h} className="pb-3 px-1 text-center text-xs font-semibold text-on-surface-variant">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(e => (
              <tr key={`${e.year}-${e.month}`} className="border-b border-outline-variant last:border-0">
                <td className="py-3 pr-2 text-xs text-on-surface-variant">{e.year}/{e.month}</td>
                <td className="py-3 px-1 text-center text-sm text-on-surface">{fmtSubject(e.kor?.grade, e.kor?.percentile)}</td>
                <td className="py-3 px-1 text-center text-sm text-on-surface">{fmtSubject(e.math?.grade, e.math?.percentile)}</td>
                <td className="py-3 px-1 text-center text-sm text-on-surface">{e.eng?.grade != null ? e.eng.grade : '—'}</td>
                <td className="py-3 px-1 text-center text-sm text-on-surface">{fmtSubject(e.exp1?.grade, e.exp1?.percentile)}</td>
                <td className="py-3 px-1 text-center text-sm text-on-surface">{fmtSubject(e.exp2?.grade, e.exp2?.percentile)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  })()

  const basicInfoContent = loading ? (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-6 w-full rounded bg-surface-container-high animate-pulse" />
      ))}
    </div>
  ) : error ? (
    <p className="text-sm text-error">{error}</p>
  ) : (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
        <h3 className="mb-6 text-sm font-semibold text-on-surface">인적 사항</h3>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5">
          {infoRows.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-xs text-on-surface-variant">{label}</dt>
              <dd className="mt-1 text-sm text-on-surface">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {(gradesTable || mockExamsTable) && (
        <div className="grid grid-cols-2 gap-6 items-stretch">
          {gradesTable}
          {mockExamsTable}
        </div>
      )}
    </div>
  )

  const inputArea = (
    <div className="flex flex-col gap-4">
      <textarea
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        placeholder="생기부 원문을 붙여넣어 주세요"
        rows={16}
        className="w-full rounded border border-outline-variant bg-surface-container-lowest p-4 text-sm text-on-surface outline-none focus:border-primary resize-none"
      />
      {analyzeError && <p className="text-xs text-error">{analyzeError}</p>}
      <div className="flex justify-end">
        <Button onClick={handleAnalyze} disabled={analyzing || !inputText.trim()}>
          {analyzing ? '분석 중...' : '분석 시작'}
        </Button>
      </div>
    </div>
  )

  const progressUI = (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
      <p className="mb-8 text-sm font-semibold text-on-surface">
        {analyzeError ? '분석 실패' : '분석 중...'}
      </p>
      <ol className="flex flex-col gap-6">
        {ANALYSIS_STEPS.map((step, i) => {
          const done = i < activeStep
          const failed = !!analyzeError && i === activeStep
          const active = !analyzeError && i === activeStep
          return (
            <li key={step} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                done
                  ? 'bg-primary'
                  : failed
                  ? 'bg-error'
                  : active
                  ? 'border-2 border-primary'
                  : 'border-2 border-outline-variant'
              }`}>
                {done ? (
                  <svg className="w-4 h-4 text-on-primary" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : failed ? (
                  <svg className="w-4 h-4 text-on-error" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : active ? (
                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                ) : null}
              </div>
              <span className={`text-sm ${
                failed ? 'text-error font-medium' : done || active ? 'text-on-surface font-medium' : 'text-on-surface-variant'
              }`}>
                {step}
              </span>
            </li>
          )
        })}
      </ol>
      {analyzeError && (
        <div className="mt-8 flex flex-col gap-3">
          <p className="text-xs text-error">{analyzeError}</p>
          <div className="flex justify-end">
            <Button onClick={handleAnalyze} disabled={!inputText.trim()}>다시 분석</Button>
          </div>
        </div>
      )}
    </div>
  )

  const analysisContent = (analyzing || !!analyzeError) ? (
    progressUI
  ) : analysisLoading ? (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-6 w-full rounded bg-surface-container-high animate-pulse" />
      ))}
    </div>
  ) : analysisHistory.length === 0 ? (
    inputArea
  ) : (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setShowInputArea(v => !v)}>
          {showInputArea ? '취소' : '재분석'}
        </Button>
      </div>
      {showInputArea && inputArea}
      <div className="text-sm text-on-surface-variant">분석 결과 준비 중</div>
    </div>
  )

  const tabs = TAB_KEYS.map(key => ({
    key,
    label: TAB_LABELS[key],
    content:
      key === 'basic' ? basicInfoContent :
      key === 'analysis' ? analysisContent : (
        <div className="text-sm text-on-surface-variant">{TAB_LABELS[key]} 준비 중</div>
      ),
  }))

  return (
    <div className="max-w-content mx-auto px-16 py-12">
      <div className="mb-8 flex items-start justify-between">
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-40 rounded-lg bg-surface-container-high animate-pulse" />
            <div className="h-4 w-28 rounded bg-surface-container-high animate-pulse" />
          </div>
        ) : student ? (
          <div>
            <h1 className="text-2xl font-semibold text-on-surface">{student.name}</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              {student.grade}학년 {student.classNum}반 {student.number}번
            </p>
          </div>
        ) : (
          <p className="text-sm text-error">{error}</p>
        )}
        <Button variant="secondary" onClick={handleOpenEdit} disabled={!student}>
          수정하기
        </Button>
      </div>

      <Tabs tabs={tabs} value={activeTab} onChange={handleTabChange} />

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
    </div>
  )
}
