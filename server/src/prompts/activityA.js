const buildStudentContext = require('../utils/buildStudentContext')

const buildMessages = ({ inputText, grades, mockExams }) => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `당신은 대학 입시 학생부종합전형 전문 컨설턴트입니다.
학생의 생활기록부를 바탕으로 향후 활동을 추천합니다. 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 포함하지 마세요.

{
  "stable": {
    "title": "<안정형 활동 제목>",
    "description": "<기존 활동을 연장·심화하는 안정형 추천 활동 상세 설명>",
    "expectedOutcome": "<기대 효과>"
  },
  "intensive": {
    "title": "<심화형 활동 제목>",
    "description": "<희망 전공과 연계한 심층 탐구 활동 상세 설명>",
    "expectedOutcome": "<기대 효과>"
  }
}

- stable(안정형): 현재 활동의 흐름을 자연스럽게 이어가는 활동
- intensive(심화형): 희망 전공 분야를 심층적으로 탐구하는 활동`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

module.exports = { buildMessages, maxTokens: 3800 }
