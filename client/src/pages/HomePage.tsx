import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

const FEATURES = [
  { title: 'AI 생기부 분석', desc: '역량 프로필·종합 진단·활동 추천·서사 설계를 실제 학종 평가 기준으로 분석' },
  { title: '성적 통합 관리', desc: '내신·모의고사 데이터를 함께 입력해 종합적인 학생 현황 파악' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-16">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-primary mb-4 tracking-tight">
          StudentAnalysis
        </h1>
        <p className="text-lg font-semibold text-on-surface mb-3">
          생기부 AI 분석 시스템
        </p>
        <p className="text-sm text-on-surface-variant mb-12 leading-relaxed">
          실제 학종 평가 기준으로 학생 생활기록부를 분석하는<br />
          통합 관리 서비스
        </p>

        <div className="grid grid-cols-2 gap-6 mb-12">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 text-left">
              <p className="text-sm font-semibold text-on-surface mb-2">{f.title}</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <Button onClick={() => navigate('/students')}>
          학생 목록 보기
        </Button>
      </div>
    </div>
  )
}
