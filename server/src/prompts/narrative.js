const buildStudentContext = require('../utils/buildStudentContext')

const buildMessages = ({ inputText, grades, mockExams }) => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `당신은 대학 입시 학생부종합전형 전문 컨설턴트입니다.
학생의 생활기록부를 바탕으로 서사 전략과 추가 탐구 아이디어를 제시하세요. 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 포함하지 마세요.

{
  "narrative": "<학생부 전체를 관통하는 서사 전략 (430~470자)>",
  "ideas": [
    "<탐구 아이디어1>",
    "<탐구 아이디어2>",
    "<탐구 아이디어3>",
    "<탐구 아이디어4>",
    "<탐구 아이디어5>",
    "<탐구 아이디어6>"
  ]
}

- narrative: 학생의 활동 전체를 하나의 이야기로 연결하는 서사 전략. 반드시 430~470자로 작성
- ideas: 향후 탐구 활동 아이디어 정확히 6개. 각 아이디어는 구체적인 주제와 방법을 포함`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

module.exports = { buildMessages, maxTokens: 1500 }
