const buildStudentContext = (grades, mockExams) => {
  const parts = []
  if (grades && grades.length > 0) {
    const lines = grades.map(g =>
      `${g.year}학년 ${g.semester}학기: ${g.subjects.map(s => `${s.name} ${s.grade}등급`).join(', ')} (평균 ${g.avgGrade}등급)`
    )
    parts.push(`[내신 성적]\n${lines.join('\n')}`)
  }
  if (mockExams && mockExams.length > 0) {
    const lines = mockExams.map(e => {
      const subjects = []
      if (e.kor?.grade) subjects.push(`국어 ${e.kor.grade}등급${e.kor.percentile != null ? ` (${e.kor.percentile}%)` : ''}`)
      if (e.math?.grade) subjects.push(`수학 ${e.math.grade}등급${e.math.percentile != null ? ` (${e.math.percentile}%)` : ''}`)
      if (e.eng?.grade) subjects.push(`영어 ${e.eng.grade}등급`)
      if (e.exp1?.grade) subjects.push(`탐구1 ${e.exp1.grade}등급${e.exp1.percentile != null ? ` (${e.exp1.percentile}%)` : ''}`)
      if (e.exp2?.grade) subjects.push(`탐구2 ${e.exp2.grade}등급${e.exp2.percentile != null ? ` (${e.exp2.percentile}%)` : ''}`)
      return `${e.year}년 ${e.month}월: ${subjects.join(', ')}`
    })
    parts.push(`[모의고사 성적]\n${lines.join('\n')}`)
  }
  return parts.join('\n\n')
}

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
