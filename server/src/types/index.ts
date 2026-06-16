export interface AppError {
  status: number
  message: string
}

export interface ISubject {
  name: string
  grade: number
}

export interface IGrade {
  year: number
  semester: number
  subjects: ISubject[]
  avgGrade?: number | null
}

export interface IExamSubject {
  grade?: number
  percentile?: number
}

export interface IEngSubject {
  grade?: number
}

export interface IMockExam {
  year: number
  month: number
  kor: IExamSubject
  math: IExamSubject
  eng: IEngSubject
  exp1: IExamSubject
  exp2: IExamSubject
}

export type MessageRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: MessageRole
  content: string
}

export interface PromptInput {
  inputText: string
  grades: IGrade[]
  mockExams: IMockExam[]
  targetUniv?: string
  targetMajor?: string
}

export interface PromptModule {
  buildMessages: (input: PromptInput) => ChatMessage[]
  maxTokens: number
  requiredKeys: string[]
}
