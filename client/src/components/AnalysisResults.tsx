import CompetencyProfileCard, { CompetencyProfile } from './CompetencyProfileCard'
import DiagnosisCard, { Diagnosis } from './DiagnosisCard'
import ActivityItemCard, { ActivityItem } from './ActivityItemCard'
import NarrativeCard, { Narrative } from './NarrativeCard'

interface ActivityResult {
  stable?: ActivityItem
  intensive?: ActivityItem
  differentiated?: ActivityItem
  practical?: ActivityItem
}

export interface AnalysisResult {
  competencyProfile: CompetencyProfile | null
  diagnosis: Diagnosis | null
  activityA: ActivityResult | null
  activityB: ActivityResult | null
  narrative: Narrative | null
}

interface Props {
  result: AnalysisResult
}

const Empty = ({ label }: { label: string }) => (
  <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-sm text-on-surface-variant">
    {label} 분석 결과가 없습니다.
  </div>
)

export default function AnalysisResults({ result }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {result.competencyProfile
        ? <CompetencyProfileCard data={result.competencyProfile} />
        : <Empty label="역량 프로필" />}

      {result.diagnosis
        ? <DiagnosisCard data={result.diagnosis} />
        : <Empty label="종합 진단" />}

      {result.activityA ? (
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
          <h3 className="mb-6 text-base font-semibold text-on-surface">활동 추천 A</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant gap-8 lg:gap-0">
            <div className="lg:pr-8">
              {result.activityA.stable && <ActivityItemCard label="안정형 활동" data={result.activityA.stable} />}
            </div>
            <div className="pt-8 lg:pt-0 lg:pl-8">
              {result.activityA.intensive && <ActivityItemCard label="심화형 활동" data={result.activityA.intensive} />}
            </div>
          </div>
        </div>
      ) : <Empty label="활동 추천 A" />}

      {result.activityB ? (
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
          <h3 className="mb-6 text-base font-semibold text-on-surface">활동 추천 B</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant gap-8 lg:gap-0">
            <div className="lg:pr-8">
              {result.activityB.differentiated && <ActivityItemCard label="차별화형 활동" data={result.activityB.differentiated} />}
            </div>
            <div className="pt-8 lg:pt-0 lg:pl-8">
              {result.activityB.practical && <ActivityItemCard label="실천형 활동" data={result.activityB.practical} />}
            </div>
          </div>
        </div>
      ) : <Empty label="활동 추천 B" />}

      {result.narrative
        ? <NarrativeCard data={result.narrative} />
        : <Empty label="서사 설계" />}
    </div>
  )
}
