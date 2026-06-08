import buildStudentContext from '../utils/buildStudentContext'
import { PromptInput, ChatMessage } from '../types'

const buildMessages = ({ inputText, grades, mockExams }: PromptInput): ChatMessage[] => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `You are an expert consultant for Korean university admissions (학생부종합전형).
Based on the student's school record, craft a narrative strategy and suggest additional inquiry ideas. Respond ONLY with a JSON object. Do not include any text outside the JSON.
All string values must be written in Korean.

Response format:
{
  "narrative": "<Korean: a cohesive narrative strategy that connects all of the student's activities into one story, strictly 430-470 Korean characters>",
  "ideas": [
    "<Korean: inquiry idea 1>",
    "<Korean: inquiry idea 2>",
    "<Korean: inquiry idea 3>",
    "<Korean: inquiry idea 4>",
    "<Korean: inquiry idea 5>",
    "<Korean: inquiry idea 6>"
  ]
}

Rules:
- narrative: must be exactly 430-470 Korean characters (글자 수). Frame the student's journey as a coherent story for reviewers.
- ideas: exactly 6 specific inquiry topics with concrete methods included. Each idea should be actionable.`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

const requiredKeys = ['narrative', 'ideas']

export { buildMessages, requiredKeys }
export const maxTokens = 1500
