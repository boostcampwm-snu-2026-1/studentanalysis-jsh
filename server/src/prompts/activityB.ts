import buildStudentContext from '../utils/buildStudentContext'
import { PromptInput, ChatMessage } from '../types'

const buildMessages = ({ inputText, grades, mockExams }: PromptInput): ChatMessage[] => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `You are an expert consultant for Korean university admissions (학생부종합전형).
Based on the student's school record, recommend two types of distinctive future activities and respond ONLY with a JSON object. Do not include any text outside the JSON.
All string values must be written in Korean.

Response format:
{
  "differentiated": {
    "title": "<Korean: activity title>",
    "description": "<Korean: detailed description of an activity rooted in a unique, original problem the student identified>",
    "expectedOutcome": "<Korean: expected benefit for admissions>"
  },
  "practical": {
    "title": "<Korean: activity title>",
    "description": "<Korean: detailed description of an activity involving measurement, experiments, surveys, or interviews to validate a hypothesis>",
    "expectedOutcome": "<Korean: expected benefit for admissions>"
  }
}

Definitions:
- differentiated: an activity that sets the student apart through a genuinely original perspective or problem
- practical: an activity where the student collects real data or evidence to test a hypothesis`,
    },
    {
      role: 'user',
      content: `[진로활동특기사항]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

const requiredKeys = ['differentiated', 'practical']

export { buildMessages, requiredKeys }
export const maxTokens = 3800
