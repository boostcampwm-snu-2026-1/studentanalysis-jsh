const buildStudentContext = require('../utils/buildStudentContext')

const buildMessages = ({ inputText, grades, mockExams }) => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `당신은 대학 입시 학생부종합전형 전문 컨설턴트입니다.
학생의 생활기록부를 바탕으로 차별화된 향후 활동을 추천합니다. 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 포함하지 마세요.

{
  "differentiated": {
    "title": "<차별화형 활동 제목>",
    "description": "<독창적 문제의식에서 출발한 차별화 활동 상세 설명>",
    "expectedOutcome": "<기대 효과>"
  },
  "practical": {
    "title": "<실천형 활동 제목>",
    "description": "<측정·실험·인터뷰 등 실질적 검증 활동 상세 설명>",
    "expectedOutcome": "<기대 효과>"
  }
}

- differentiated(차별화형): 다른 학생들과 구별되는 독창적 문제의식에서 출발한 활동
- practical(실천형): 가설을 세우고 측정·실험·인터뷰 등으로 직접 검증하는 활동`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

module.exports = { buildMessages, maxTokens: 3800 }
