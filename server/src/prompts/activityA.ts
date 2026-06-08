import buildStudentContext from '../utils/buildStudentContext'
import { PromptInput, ChatMessage } from '../types'

const buildMessages = ({ inputText, grades, mockExams }: PromptInput): ChatMessage[] => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `You are an expert consultant for Korean university admissions (학생부종합전형).
Based on the student's school record, recommend two types of future activities and respond ONLY with a JSON object. Do not include any text outside the JSON.
All string values must be written in Korean.

Response format:
{
  "stable": {
    "title": "<Korean: activity title>",
    "description": "<Korean: detailed description of a stable activity that naturally extends the student's existing work>",
    "expectedOutcome": "<Korean: expected benefit for admissions>"
  },
  "intensive": {
    "title": "<Korean: activity title>",
    "description": "<Korean: detailed description of an intensive activity that deeply explores the student's intended major>",
    "expectedOutcome": "<Korean: expected benefit for admissions>"
  }
}

Definitions:
- stable: an activity that continues and deepens the student's current trajectory with low risk
- intensive: an activity that demonstrates serious academic commitment to the intended major`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

const requiredKeys = ['stable', 'intensive']

export { buildMessages, requiredKeys }
export const maxTokens = 3800
