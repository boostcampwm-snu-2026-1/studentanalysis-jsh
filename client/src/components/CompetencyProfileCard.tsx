import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { colors } from '../utils/tokens'

export interface CompetencyProfile {
  careerFitScore: number
  careerFitEvidence: string
  continuityScore: number
  continuityEvidence: string
  narrativeScore: number
  narrativeEvidence: string
  depthScore: number
  depthEvidence: string
}

const COMPETENCIES = [
  { scoreKey: 'careerFitScore', evidenceKey: 'careerFitEvidence', label: '진로 적합성' },
  { scoreKey: 'continuityScore', evidenceKey: 'continuityEvidence', label: '탐구 연속성' },
  { scoreKey: 'narrativeScore', evidenceKey: 'narrativeEvidence', label: '서사 일관성' },
  { scoreKey: 'depthScore', evidenceKey: 'depthEvidence', label: '심화 잠재력' },
] as const

interface Props {
  data: CompetencyProfile
}

export default function CompetencyProfileCard({ data }: Props) {
  const chartData = COMPETENCIES.map(({ scoreKey, label }) => ({
    subject: label,
    score: data[scoreKey],
  }))

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
      <h3 className="mb-6 text-base font-semibold text-on-surface">역량 프로필</h3>

      {/* 레이더 차트 + 핵심 지표 */}
      <div className="flex flex-col lg:flex-row gap-10 mb-8">
        <div className="w-full lg:w-2/5">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={chartData} margin={{ top: 20, right: 36, bottom: 20, left: 36 }}>
              <PolarGrid stroke={colors.outlineVariant} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 12, fill: colors.onSurfaceVariant }}
              />
              <Radar
                dataKey="score"
                stroke={colors.primary}
                fill={colors.primary}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-5 w-full lg:w-3/5 justify-center lg:pr-12">
          {COMPETENCIES.map(({ scoreKey, label }) => (
            <div key={scoreKey}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-on-surface-variant">{label}</span>
                <span className="text-xs font-semibold text-on-surface">{data[scoreKey]}</span>
              </div>
              <div className="h-1 w-full rounded-full bg-primary-container">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${data[scoreKey]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 근거 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COMPETENCIES.map(({ scoreKey, evidenceKey, label }) => (
          <div key={scoreKey} className="rounded border border-outline-variant p-5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold text-on-surface-variant">{label}</span>
              <span className="text-2xl font-bold text-primary leading-none">{data[scoreKey]}</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">{data[evidenceKey]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
