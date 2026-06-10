import buildStudentContext from '../utils/buildStudentContext'
import { PromptInput, ChatMessage } from '../types'

const buildMessages = ({ inputText, grades, mockExams }: PromptInput): ChatMessage[] => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `You are an expert analyst for Korean university admissions (학생부종합전형).
Provide a comprehensive diagnosis of the student's school record and respond ONLY with a JSON object. Do not include any text outside the JSON.
All string values must be written in Korean.

Response format:
{
  "summary": "<Korean: overall summary of the student's activities, 200 characters or less>",
  "strengths": ["<Korean: strength 1>", "<Korean: strength 2>", "<Korean: strength 3>"],
  "weaknesses": ["<Korean: weakness 1>", "<Korean: weakness 2>", "<Korean: weakness 3>"],
  "suggestedMajors": ["<Korean: major 1>", "<Korean: major 2>", "<Korean: major 3>"]
}

Rules:
- strengths: exactly 3 standout strengths visible in the record
- weaknesses: exactly 3 areas that need improvement for holistic admissions
- suggestedMajors: 3 to 5 majors that match the student's demonstrated competencies and interests`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

const requiredKeys = ['summary', 'strengths', 'weaknesses', 'suggestedMajors']

export { buildMessages, requiredKeys }
export const maxTokens = 2800
