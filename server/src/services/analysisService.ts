// @ts-nocheck
const openai = require('../openaiClient')
const studentRepository = require('../repositories/studentRepository')
const analysisRepository = require('../repositories/analysisRepository')
const competencyProfilePrompt = require('../prompts/competencyProfile')
const diagnosisPrompt = require('../prompts/diagnosis')
const activityAPrompt = require('../prompts/activityA')
const activityBPrompt = require('../prompts/activityB')
const narrativePrompt = require('../prompts/narrative')

async function callOpenAI(promptModule, inputData, retries = 1) {
  try {
    const messages = promptModule.buildMessages(inputData)
    const res = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages,
      max_tokens: promptModule.maxTokens,
    })
    const parsed = JSON.parse(res.choices[0].message.content)
    const missing = promptModule.requiredKeys.filter(k => !(k in parsed))
    if (missing.length > 0) throw { status: 500, message: `분석 결과에 필수 키가 누락됐습니다: ${missing.join(', ')}` }
    return parsed
  } catch (err) {
    if (retries > 0) return callOpenAI(promptModule, inputData, retries - 1)
    throw err
  }
}

async function runCompetencyProfile(inputData) {
  return callOpenAI(competencyProfilePrompt, inputData)
}

async function runDiagnosis(inputData) {
  return callOpenAI(diagnosisPrompt, inputData)
}

async function runActivityA(inputData) {
  return callOpenAI(activityAPrompt, inputData)
}

async function runActivityB(inputData) {
  return callOpenAI(activityBPrompt, inputData)
}

async function runNarrative(inputData) {
  return callOpenAI(narrativePrompt, inputData)
}

async function analyze(inputData) {
  const [competencyProfile, diagnosis, activityA, activityB, narrative] = await Promise.all([
    runCompetencyProfile(inputData),
    runDiagnosis(inputData),
    runActivityA(inputData),
    runActivityB(inputData),
    runNarrative(inputData),
  ])
  return { competencyProfile, diagnosis, activityA, activityB, narrative }
}

async function getByStudentId(studentId) {
  return analysisRepository.findByStudentId(studentId)
}

async function getById(id) {
  const analysis = await analysisRepository.findById(id)
  if (!analysis) throw { status: 404, message: '분석 결과를 찾을 수 없습니다.' }
  return analysis
}

async function runAndSave(studentId, inputText) {
  const student = await studentRepository.findById(studentId)
  if (!student) throw { status: 404, message: '학생을 찾을 수 없습니다.' }

  const result = await analyze({ inputText, grades: student.grades, mockExams: student.mockExams })
  return analysisRepository.create({ studentId, inputText, result })
}

module.exports = { runCompetencyProfile, runDiagnosis, runActivityA, runActivityB, runNarrative, analyze, getByStudentId, getById, runAndSave }
