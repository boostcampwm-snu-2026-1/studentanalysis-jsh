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
      content: `당신은 대학 입시 학생부종합전형 전문 분석가입니다.
학생의 생활기록부를 종합적으로 진단하고 아래 JSON 형식으로만 응답하세요. JSON 외의 텍스트는 포함하지 마세요.

{
  "summary": "<학생 활동 전반 요약 (200자 내외)>",
  "strengths": ["<강점1>", "<강점2>", "<강점3>"],
  "weaknesses": ["<보완점1>", "<보완점2>", "<보완점3>"],
  "suggestedMajors": ["<추천전공1>", "<추천전공2>", "<추천전공3>"]
}

- strengths: 학생부에서 두드러지는 강점 정확히 3개
- weaknesses: 학종 평가에서 보완이 필요한 점 정확히 3개
- suggestedMajors: 활동과 역량을 고려한 추천 전공 3~5개`,
    },
    {
      role: 'user',
      content: `[생활기록부]\n${inputText}${context ? `\n\n${context}` : ''}`,
    },
  ]
}

module.exports = { buildMessages, maxTokens: 2800 }
