import { Grade } from '../hooks/useStudents'

interface Props {
  grades: Grade[]
}

export default function GradesTable({ grades }: Props) {
  const sorted = [...grades].sort((a, b) => a.year - b.year || a.semester - b.semester)
  const byYear = sorted.reduce<Record<number, typeof sorted>>((acc, g) => {
    ;(acc[g.year] ??= []).push(g)
    return acc
  }, {})

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-8 h-full">
      <h3 className="mb-6 text-base font-semibold text-on-surface">내신 성적</h3>
      <div className="flex flex-col gap-6">
        {Object.entries(byYear).map(([year, entries]) => {
          const subjectCols = [...new Set(entries.flatMap(g => g.subjects.map(s => s.name)))]
          return (
            <div key={year}>
              <p className="mb-3 text-xs font-semibold text-on-surface-variant">{year}학년</p>
              <table className="w-full table-fixed text-sm">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="pb-3 pr-2 text-left text-xs font-semibold text-on-surface-variant w-12">학기</th>
                    {subjectCols.map(col => (
                      <th key={col} className="pb-3 px-1 text-center text-xs font-semibold text-on-surface-variant truncate">{col}</th>
                    ))}
                    <th className="pb-3 pl-1 text-center text-xs font-semibold text-on-surface-variant w-10">평균</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(g => {
                    const gradeMap = Object.fromEntries(g.subjects.map(s => [s.name, s.grade]))
                    return (
                      <tr key={g.semester} className="border-b border-outline-variant last:border-0">
                        <td className="py-3 pr-2 text-xs text-on-surface-variant">{g.semester}학기</td>
                        {subjectCols.map(col => (
                          <td key={col} className="py-3 px-1 text-center text-sm text-on-surface">
                            {gradeMap[col] != null ? gradeMap[col] : '—'}
                          </td>
                        ))}
                        <td className="py-3 pl-1 text-center text-sm font-semibold text-on-surface">
                          {g.avgGrade != null ? g.avgGrade : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  )
}
