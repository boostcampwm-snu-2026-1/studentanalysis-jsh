export interface Diagnosis {
  summary: string
  strengths: string[]
  weaknesses: string[]
  suggestedMajors: string[]
}

interface Props {
  data: Diagnosis
}

export default function DiagnosisCard({ data }: Props) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
      <h3 className="mb-6 text-base font-semibold text-on-surface">종합 진단</h3>
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2">
          <p className="text-sm text-on-surface-variant leading-relaxed">{data.summary}</p>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-1/2 lg:pr-12">
          <div>
            <p className="mb-3 text-xs font-semibold text-on-surface">강점</p>
            <div className="flex flex-wrap gap-2">
              {data.strengths.map(s => (
                <span key={s} className="rounded-full bg-primary-container px-3 py-1 text-xs font-medium text-on-primary-container">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold text-on-surface">보완점</p>
            <div className="flex flex-wrap gap-2">
              {data.weaknesses.map(w => (
                <span key={w} className="rounded-full bg-error-container px-3 py-1 text-xs font-medium text-on-error-container">
                  {w}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold text-on-surface">추천 전공</p>
            <div className="flex flex-wrap gap-2">
              {data.suggestedMajors.map(m => (
                <span key={m} className="rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-secondary">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
