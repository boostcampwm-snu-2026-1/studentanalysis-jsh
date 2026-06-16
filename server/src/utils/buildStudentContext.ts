import { IGrade, IMockExam } from '../types'

const buildStudentContext = (
  grades: IGrade[],
  mockExams: IMockExam[],
  targetUniv?: string,
  targetMajor?: string
): string => {
  const parts: string[] = []

  if (targetUniv || targetMajor) {
    parts.push(`[목표 진로]\n목표대학: ${targetUniv || '미입력'}, 목표계열: ${targetMajor || '미입력'}`)
  }

  if (grades && grades.length > 0) {
    const lines = grades.map((g) =>
      `${g.year}학년 ${g.semester}학기: ${g.subjects.map((s) => `${s.name} ${s.grade}등급`).join(', ')} (평균 ${g.avgGrade}등급)`
    )
    parts.push(`[내신 성적]\n${lines.join('\n')}`)
  }

  if (mockExams && mockExams.length > 0) {
    const lines = mockExams.map((e) => {
      const subjects: string[] = []
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

export default buildStudentContext
