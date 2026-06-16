import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Tabs from '../components/Tabs'
import useStudent from '../hooks/useStudent'
import BasicInfoTab from '../components/BasicInfoTab'
import AnalysisTab from '../components/AnalysisTab'

const TAB_KEYS = ['basic', 'analysis'] as const
type TabKey = (typeof TAB_KEYS)[number]

const TAB_LABELS: Record<TabKey, string> = {
  basic: '기본 정보',
  analysis: '생기부 분석',
}

export default function StudentDetailPage() {
  const { id: studentId } = useParams<{ id: string }>()
  const { student, loading, error, refetch } = useStudent(studentId!)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const rawTab = searchParams.get('tab')
  const activeTab: TabKey = TAB_KEYS.includes(rawTab as TabKey) ? (rawTab as TabKey) : 'basic'

  const handleTabChange = (key: string) => {
    navigate({ pathname, search: `?tab=${key}` }, { replace: true })
  }

  const tabs = TAB_KEYS.map(key => ({
    key,
    label: TAB_LABELS[key],
    content:
      key === 'basic' ? (
        <BasicInfoTab
          studentId={studentId!}
          student={student}
          loading={loading}
          error={error}
          refetch={refetch}
        />
      ) : (
        <AnalysisTab studentId={studentId!} />
      ),
  }))

  return (
    <div className="max-w-content mx-auto px-4 sm:px-8 lg:px-16 py-6 lg:py-12">
      <div className="mb-8">
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
      </div>

      <Tabs tabs={tabs} value={activeTab} onChange={handleTabChange} />
    </div>
  )
}
