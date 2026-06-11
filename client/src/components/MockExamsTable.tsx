import { MockExam } from '../hooks/useStudents'

interface Props {
  mockExams: MockExam[]
}

export default function MockExamsTable({ mockExams }: Props) {
  const sorted = [...mockExams].sort((a, b) => b.year - a.year || b.month - a.month)

  const fmtSubject = (grade?: number, percentile?: number) => {
    if (grade == null) return '—'
    return percentile != null ? `${grade} (${percentile}%)` : `${grade}`
  }

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 h-full">
      <h3 className="mb-6 text-sm font-semibold text-on-surface">모의고사 성적</h3>
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-outline-variant">
            <th className="pb-3 pr-2 text-left text-xs font-semibold text-on-surface-variant w-16">시험</th>
            {['국어', '수학', '영어', '탐구1', '탐구2'].map(h => (
              <th key={h} className="pb-3 px-1 text-center text-xs font-semibold text-on-surface-variant">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(e => (
            <tr key={`${e.year}-${e.month}`} className="border-b border-outline-variant last:border-0">
              <td className="py-3 pr-2 text-xs text-on-surface-variant">{e.year}/{e.month}</td>
              <td className="py-3 px-1 text-center text-sm text-on-surface">{fmtSubject(e.kor?.grade, e.kor?.percentile)}</td>
              <td className="py-3 px-1 text-center text-sm text-on-surface">{fmtSubject(e.math?.grade, e.math?.percentile)}</td>
              <td className="py-3 px-1 text-center text-sm text-on-surface">{e.eng?.grade != null ? e.eng.grade : '—'}</td>
              <td className="py-3 px-1 text-center text-sm text-on-surface">{fmtSubject(e.exp1?.grade, e.exp1?.percentile)}</td>
              <td className="py-3 px-1 text-center text-sm text-on-surface">{fmtSubject(e.exp2?.grade, e.exp2?.percentile)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
