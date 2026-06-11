import { useState, useEffect, useCallback } from 'react'
import Button from './Button'
import CompetencyProfileCard, { CompetencyProfile } from './CompetencyProfileCard'
import DiagnosisCard, { Diagnosis } from './DiagnosisCard'
import client from '../api/client'

interface Analysis {
  _id: string
  inputText: string
  result: {
    competencyProfile: CompetencyProfile | null
    diagnosis: Diagnosis | null
    activityA: unknown
    activityB: unknown
    narrative: unknown
  }
  createdAt: string
}

const ANALYSIS_STEPS = ['역량 프로필', '종합 진단', '활동 추천 A', '활동 추천 B', '서사 설계'] as const

interface Props {
  studentId: string
}

export default function AnalysisTab({ studentId }: Props) {
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

  useEffect(() => {
    if (!analysisFetched) fetchAnalysis()
  }, [analysisFetched, fetchAnalysis])

  useEffect(() => {
    if (!analyzing) return
    setActiveStep(0)
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev))
    }, 3000)
    return () => clearInterval(interval)
  }, [analyzing])

  const handleAnalyze = async () => {
    if (!inputText.trim()) return
    setAnalyzing(true)
    setAnalyzeError(null)
    try {
      await client.post(`/api/students/${studentId}/analyze`, { inputText })
      setShowInputArea(false)
      setInputText('')
      setAnalysisFetched(false)
    } catch (err) {
      setAnalyzeError((err as Error).message)
    } finally {
      setAnalyzing(false)
    }
  }

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

  if (analyzing || !!analyzeError) return progressUI

  if (analysisLoading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-6 w-full rounded bg-surface-container-high animate-pulse" />
      ))}
    </div>
  )

  if (analysisHistory.length === 0) return inputArea

  const latest = analysisHistory[0]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setShowInputArea(v => !v)}>
          {showInputArea ? '취소' : '재분석'}
        </Button>
      </div>
      {showInputArea && inputArea}
      <div className="flex flex-col gap-6">
        {latest.result.competencyProfile ? (
          <CompetencyProfileCard data={latest.result.competencyProfile} />
        ) : (
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-sm text-on-surface-variant">
            역량 프로필 분석 결과가 없습니다.
          </div>
        )}
        {latest.result.diagnosis ? (
          <DiagnosisCard data={latest.result.diagnosis} />
        ) : (
          <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 text-sm text-on-surface-variant">
            종합 진단 분석 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
