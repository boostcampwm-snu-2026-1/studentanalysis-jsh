import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import Tabs from '../components/Tabs'

const TAB_KEYS = ['basic', 'analysis', 'consultation', 'university'] as const
type TabKey = (typeof TAB_KEYS)[number]

const TAB_LABELS: Record<TabKey, string> = {
  basic: '기본 정보',
  analysis: '생기부 분석',
  consultation: '상담 기록',
  university: '대학 탐색',
}

export default function StudentDetailPage() {
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
    content: (
      <div className="text-sm text-on-surface-variant">{TAB_LABELS[key]} 준비 중</div>
    ),
  }))

  return (
    <div className="max-w-content mx-auto px-16 py-12">
      <div className="mb-8 h-10 w-56 rounded-lg bg-surface-container-high animate-pulse" />
      <Tabs tabs={tabs} value={activeTab} onChange={handleTabChange} />
    </div>
  )
}
