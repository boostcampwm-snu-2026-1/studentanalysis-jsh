import buildStudentContext from '../utils/buildStudentContext'
import { PromptInput, ChatMessage } from '../types'

const buildMessages = ({ inputText, grades, mockExams }: PromptInput): ChatMessage[] => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `You are an expert consultant for Korean university admissions (학생부종합전형).
Based on the student's school record, analyze their narrative and respond ONLY with a JSON object. Do not include any text outside the JSON.
All string values must be written in Korean.

Response format:
{
  "strengthNarrative": "<Korean: 2-3 sentences describing the student's core narrative strength and how their activities connect into one story>",
  "weakness": "<Korean: 1-2 sentences identifying the weakest point in the student's narrative that reviewers might question>",
  "improvement": "<Korean: 1-2 sentences of concrete advice on how to address the narrative weakness>",
  "interviewPoints": [
    "<Korean: interview point 1>",
    "<Korean: interview point 2>",
    "<Korean: interview point 3>",
    "<Korean: interview point 4>"
  ],
  "guide": "<Korean: a cohesive comprehensive narrative guide (430-470 Korean characters) that connects all activities into one story for reviewers>",
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
- interviewPoints: exactly 4 items, each a specific question the student should prepare for
- guide: must be exactly 430-470 Korean characters
- ideas: exactly 6 specific inquiry topics with concrete methods`,
    },
    {
      role: 'user',
      content: `[진로활동특기사항]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

const requiredKeys = ['strengthNarrative', 'weakness', 'improvement', 'interviewPoints', 'guide', 'ideas']

export { buildMessages, requiredKeys }
export const maxTokens = 2000
