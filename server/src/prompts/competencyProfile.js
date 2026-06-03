const buildStudentContext = require('../utils/buildStudentContext')

const buildMessages = ({ inputText, grades, mockExams }) => {
  const context = buildStudentContext(grades, mockExams)

  return [
    {
      role: 'system',
      content: `당신은 대학 입시 학생부종합전형 전문 분석가입니다.
학생의 생활기록부를 읽고 아래 4가지 역량을 0~100점으로 평가하고 각 항목의 근거를 제시하세요.
반드시 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 포함하지 마세요.

{
  "careerFitScore": <0~100 정수>,
  "careerFitEvidence": "<진로적합성 평가 근거>",
  "continuityScore": <0~100 정수>,
  "continuityEvidence": "<탐구연속성 평가 근거>",
  "narrativeScore": <0~100 정수>,
  "narrativeEvidence": "<서사일관성 평가 근거>",
  "depthScore": <0~100 정수>,
  "depthEvidence": "<심화잠재력 평가 근거>"
}

평가 기준:
- 진로적합성(careerFit): 희망 진로와 활동들의 연관성
- 탐구연속성(continuity): 한 주제를 지속적으로 탐구하는 흐름
- 서사일관성(narrative): 학생부 전체를 관통하는 일관된 이야기
- 심화잠재력(depth): 표면적 참여를 넘어 심층 탐구로 발전할 가능성`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

module.exports = { buildMessages, maxTokens: 3500 }
