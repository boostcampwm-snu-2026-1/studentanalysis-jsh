export interface Narrative {
  strengthNarrative: string
  weakness: string
  improvement: string
  interviewPoints: string[]
  guide: string
  ideas: string[]
}

interface Props {
  data: Narrative
}

export default function NarrativeCard({ data }: Props) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 flex flex-col gap-8">
      <h3 className="text-base font-semibold text-on-surface">서사 설계</h3>

      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-on-surface">강점 서사</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">{data.strengthNarrative}</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-on-surface">서사 약점</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">{data.weakness}</p>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-on-surface">보완 방법</p>
          <p className="text-sm text-on-surface-variant leading-relaxed">{data.improvement}</p>
        </div>
      </div>

      <hr className="border-outline-variant" />

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-on-surface">면접 포인트</p>
        <div className="flex flex-wrap gap-2">
          {data.interviewPoints.map((point, i) => (
            <span key={i} className="rounded-full bg-primary-container px-4 py-1.5 text-xs text-on-surface">
              {point}
            </span>
          ))}
        </div>
      </div>

      <hr className="border-outline-variant" />

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-on-surface">종합 서사 가이드</p>
        <p className="text-sm text-on-surface leading-relaxed">{data.guide}</p>
      </div>

      <hr className="border-outline-variant" />

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold text-on-surface">탐구 아이디어</p>
        <div className="grid grid-cols-2 gap-4">
          {data.ideas.map((idea, i) => (
            <div key={i} className="flex gap-4 rounded border border-outline-variant bg-surface p-5">
              <div className="w-6 h-6 rounded-full bg-primary-container text-on-surface flex items-center justify-center shrink-0 text-xs font-bold">
                {i + 1}
              </div>
              <p className="text-sm text-on-surface leading-relaxed">{idea}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
