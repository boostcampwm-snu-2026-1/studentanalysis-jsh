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
