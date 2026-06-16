import openai from '../openaiClient'
import * as studentRepository from '../repositories/studentRepository'
import * as analysisRepository from '../repositories/analysisRepository'
import * as competencyProfilePrompt from '../prompts/competencyProfile'
import * as diagnosisPrompt from '../prompts/diagnosis'
import * as activityAPrompt from '../prompts/activityA'
import * as activityBPrompt from '../prompts/activityB'
import * as narrativePrompt from '../prompts/narrative'
import { AppError, PromptModule, PromptInput } from '../types'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// CJK Han(한자)·가나·시릴·아랍·히브리·베트남어 확장 라틴(A/B 포함)·결합 발음 구별 기호·그리스 문자 범위
const FOREIGN_SCRIPT_REGEX =
  /[一-鿿㐀-䶿぀-ゟ゠-ヿЀ-ӿ؀-ۿ֐-׿Ā-ɏḀ-ỿ̀-ͯͰ-Ͽ]/

function containsForeignScript(value: unknown): boolean {
  if (typeof value === 'string') return FOREIGN_SCRIPT_REGEX.test(value)
  if (Array.isArray(value)) return value.some(containsForeignScript)
  if (value && typeof value === 'object') return Object.values(value).some(containsForeignScript)
  return false
}

// 교내 수상·일회성 반복 실험은 85점 이상의 근거가 되지 않으므로, 전국·지역 단위 이상의 외부 인정(수상·논문·특허 등)이
// 명시되지 않으면 competencyProfile 점수를 84점으로 강제 제한한다. (LLM이 프롬프트 지시만으로는 점수를 잘 낮추지 않아 추가)
const EXTERNAL_DISTINCTION_REGEX =
  /전국|광역시\s?대회|특별시\s?대회|도\s?대회|시\s?대회|교외|대외|국제|올림피아드|논문|특허|게재|등재|출판/
const COMPETENCY_SCORE_KEYS = ['careerFitScore', 'continuityScore', 'narrativeScore', 'depthScore'] as const
const SCORE_CAP_WITHOUT_DISTINCTION = 84

function applyCompetencyScoreCap(result: Record<string, unknown>, inputText: string): void {
  if (EXTERNAL_DISTINCTION_REGEX.test(inputText)) return
  for (const key of COMPETENCY_SCORE_KEYS) {
    const score = result[key]
    if (typeof score === 'number' && score > SCORE_CAP_WITHOUT_DISTINCTION) {
      result[key] = SCORE_CAP_WITHOUT_DISTINCTION
    }
  }
}

const STEP_PROMPTS: Record<string, PromptModule> = {
  competencyProfile: competencyProfilePrompt,
  diagnosis: diagnosisPrompt,
  activityA: activityAPrompt,
  activityB: activityBPrompt,
  narrative: narrativePrompt,
}

async function callLLM(
  promptModule: PromptModule,
  inputData: PromptInput,
  retries = 2
): Promise<Record<string, unknown>> {
  try {
    const messages = promptModule.buildMessages(inputData)
    const res = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? 'llama-3.3-70b-versatile',
      messages: messages as Parameters<typeof openai.chat.completions.create>[0]['messages'],
      max_tokens: promptModule.maxTokens,
      temperature: 0.3,
    })
    const raw = res.choices[0].message.content
    if (!raw) throw { status: 500, message: '분석 결과가 비어있습니다.' } as AppError
    const content = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed = JSON.parse(content) as Record<string, unknown>
    const missing = promptModule.requiredKeys.filter(k => !(k in parsed))
    if (missing.length > 0)
      throw { status: 500, message: `분석 결과에 필수 키가 누락됐습니다: ${missing.join(', ')}` } as AppError
    if (containsForeignScript(parsed))
      throw { status: 500, message: '분석 결과에 한국어가 아닌 문자가 포함됐습니다.' } as AppError
    return parsed
  } catch (err) {
    const error = err as { status?: number }
    if (retries > 0) {
      if (error.status === 429) await sleep(15000)
      return callLLM(promptModule, inputData, retries - 1)
    }
    throw err
  }
}

async function getByStudentId(studentId: string) {
  return analysisRepository.findByStudentId(studentId)
}

async function getById(id: string) {
  const analysis = await analysisRepository.findById(id)
  if (!analysis) throw { status: 404, message: '분석 결과를 찾을 수 없습니다.' } as AppError
  return analysis
}

async function initAnalysis(studentId: string, inputText: string) {
  const student = await studentRepository.findById(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없습니다.' } as AppError
  return analysisRepository.init(studentId, inputText)
}

async function runStep(analysisId: string, step: string) {
  const analysis = await analysisRepository.findById(analysisId)
  if (!analysis) throw { status: 404, message: '분석 레코드를 찾을 수 없습니다.' } as AppError

  const promptModule = STEP_PROMPTS[step]
  if (!promptModule) throw { status: 400, message: `알 수 없는 분석 항목: ${step}` } as AppError

  const student = await studentRepository.findById(analysis.studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없습니다.' } as AppError

  const inputData: PromptInput = {
    inputText: analysis.inputText,
    grades: student.grades,
    mockExams: student.mockExams,
    targetUniv: student.targetUniv,
    targetMajor: student.targetMajor,
  }
  const result = await callLLM(promptModule, inputData)
  if (step === 'competencyProfile') applyCompetencyScoreCap(result, analysis.inputText)
  return analysisRepository.updateStep(analysisId, step, result)
}

export { getByStudentId, getById, initAnalysis, runStep }
