import Button from './Button'

export const ANALYSIS_STEPS = ['역량 프로필', '종합 진단', '활동 추천 A', '활동 추천 B', '서사 설계'] as const

interface Props {
  activeStep: number
  error: string | null
  onRetry: () => void
  retryDisabled: boolean
}

export default function AnalysisProgress({ activeStep, error, onRetry, retryDisabled }: Props) {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8">
      <p className="mb-8 text-sm font-semibold text-on-surface">
        {error ? '분석 실패' : '분석 중...'}
      </p>
      <ol className="flex flex-col gap-6">
        {ANALYSIS_STEPS.map((step, i) => {
          const done = i < activeStep
          const failed = !!error && i === activeStep
          const active = !error && i === activeStep
          return (
            <li key={step} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                done ? 'bg-primary' : failed ? 'bg-error' : active ? 'border-2 border-primary' : 'border-2 border-outline-variant'
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
      {error && (
        <div className="mt-8 flex flex-col gap-3">
          <p className="text-xs text-error">{error}</p>
          <div className="flex justify-end">
            <Button onClick={onRetry} disabled={retryDisabled}>다시 분석</Button>
          </div>
        </div>
      )}
    </div>
  )
}
