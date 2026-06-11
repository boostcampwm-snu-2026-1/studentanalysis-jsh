import { useState } from 'react'
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Tabs from '../components/Tabs'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Input from '../components/Input'
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

  const rawTab = searchParams.get('tab')
  const activeTab: TabKey = TAB_KEYS.includes(rawTab as TabKey) ? (rawTab as TabKey) : 'basic'

  const handleTabChange = (key: string) => {
    navigate({ pathname, search: `?tab=${key}` }, { replace: true })
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

  const infoRows = student
    ? [
        { label: '이름', value: student.name },
        { label: '학년', value: `${student.grade}학년` },
        { label: '반', value: `${student.classNum}반` },
        { label: '번호', value: `${student.number}번` },
        { label: '목표 대학', value: student.targetUniv || '—' },
        { label: '목표 계열', value: student.targetMajor || '—' },
      ]
    : []

  const basicInfoContent = loading ? (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-6 w-full rounded bg-surface-container-high animate-pulse" />
      ))}
    </div>
  ) : error ? (
    <p className="text-sm text-error">{error}</p>
  ) : (
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
  )

  const tabs = TAB_KEYS.map(key => ({
    key,
    label: TAB_LABELS[key],
    content:
      key === 'basic' ? basicInfoContent : (
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
