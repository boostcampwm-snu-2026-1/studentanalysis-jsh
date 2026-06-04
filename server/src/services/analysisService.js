const openai = require('../openaiClient')
const competencyProfilePrompt = require('../prompts/competencyProfile')
const diagnosisPrompt = require('../prompts/diagnosis')
const activityAPrompt = require('../prompts/activityA')
const activityBPrompt = require('../prompts/activityB')
const narrativePrompt = require('../prompts/narrative')

async function callOpenAI(promptModule, inputData) {
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

module.exports = { runCompetencyProfile, runDiagnosis, runActivityA, runActivityB, runNarrative, analyze }
