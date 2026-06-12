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
    })
    const raw = res.choices[0].message.content
    if (!raw) throw { status: 500, message: '분석 결과가 비어있습니다.' } as AppError
    const content = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    const parsed = JSON.parse(content) as Record<string, unknown>
    const missing = promptModule.requiredKeys.filter(k => !(k in parsed))
    if (missing.length > 0)
      throw { status: 500, message: `분석 결과에 필수 키가 누락됐습니다: ${missing.join(', ')}` } as AppError
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

  const inputData: PromptInput = { inputText: analysis.inputText, grades: student.grades, mockExams: student.mockExams }
  const result = await callLLM(promptModule, inputData)
  return analysisRepository.updateStep(analysisId, step, result)
}

export { getByStudentId, getById, initAnalysis, runStep }
