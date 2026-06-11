import { useState, useEffect, useCallback } from 'react'
import Button from './Button'
import AnalysisProgress, { ANALYSIS_STEPS } from './AnalysisProgress'
import AnalysisResults, { AnalysisResult } from './AnalysisResults'
import client from '../api/client'

interface Analysis {
  _id: string
  inputText: string
  result: AnalysisResult
  createdAt: string
}

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
  const [selectedIndex, setSelectedIndex] = useState(0)

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
      setSelectedIndex(0)
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

  if (analyzing || !!analyzeError) return (
    <AnalysisProgress
      activeStep={activeStep}
      error={analyzeError}
      onRetry={handleAnalyze}
      retryDisabled={!inputText.trim()}
    />
  )

  if (analysisLoading) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-6 w-full rounded bg-surface-container-high animate-pulse" />
      ))}
    </div>
  )

  if (analysisHistory.length === 0) return inputArea

  const latest = analysisHistory[selectedIndex]

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}. ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end gap-3">
        {analysisHistory.length > 1 && (
          <div className="relative">
            <select
              value={selectedIndex}
              onChange={e => setSelectedIndex(Number(e.target.value))}
              className="appearance-none rounded border border-primary bg-transparent pl-4 pr-10 py-4 text-sm font-semibold text-primary outline-none cursor-pointer"
            >
              {analysisHistory.map((a, i) => (
                <option key={a._id} value={i}>
                  {fmtDate(a.createdAt)}{i === 0 ? ' (최신)' : ''}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" viewBox="0 0 16 16" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <Button variant="secondary" onClick={() => setShowInputArea(v => !v)}>
          {showInputArea ? '취소' : '재분석'}
        </Button>
      </div>
      {showInputArea && inputArea}
      <AnalysisResults result={latest.result} />
    </div>
  )
}
