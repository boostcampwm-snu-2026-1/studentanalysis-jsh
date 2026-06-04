const openai = require('../openaiClient')
const competencyProfilePrompt = require('../prompts/competencyProfile')
const diagnosisPrompt = require('../prompts/diagnosis')

async function callOpenAI(promptModule, inputData) {
  const messages = promptModule.buildMessages(inputData)
  const res = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages,
    max_tokens: promptModule.maxTokens,
  })
  return JSON.parse(res.choices[0].message.content)
}

async function runCompetencyProfile(inputData) {
  return callOpenAI(competencyProfilePrompt, inputData)
}

async function runDiagnosis(inputData) {
  return callOpenAI(diagnosisPrompt, inputData)
}

module.exports = { runCompetencyProfile, runDiagnosis }
