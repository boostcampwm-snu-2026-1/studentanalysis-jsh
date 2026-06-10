import { useNavigate } from 'react-router-dom'
import useStudents from '../hooks/useStudents'
import Button from '../components/Button'

export default function StudentListPage() {
  const navigate = useNavigate()
  const { students, loading, error } = useStudents()

  if (loading) return <p className="text-sm text-on-surface-variant py-10 text-center">불러오는 중...</p>
  if (error) return <p className="text-sm text-error py-10 text-center">{error}</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-base font-semibold text-on-surface">학생 목록</h2>
        <Button onClick={() => navigate('/students/new')}>학생 등록</Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-outline-variant">
            {['이름', '학년', '반', '번호', '희망대학', '희망학과', '관리'].map(col => (
              <th key={col} className="text-left text-xs font-semibold text-on-surface-variant py-3 pr-6">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-sm text-on-surface-variant text-center py-10">
                등록된 학생이 없습니다.
              </td>
            </tr>
          ) : (
            students.map(s => (
              <tr key={s.studentId} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                <td className="text-sm text-on-surface py-6 pr-6">{s.name}</td>
                <td className="text-sm text-on-surface py-6 pr-6">{s.grade}학년</td>
                <td className="text-sm text-on-surface py-6 pr-6">{s.classNum}반</td>
                <td className="text-sm text-on-surface py-6 pr-6">{s.number}번</td>
                <td className="text-sm text-on-surface py-6 pr-6">{s.targetUniv || '—'}</td>
                <td className="text-sm text-on-surface py-6 pr-6">{s.targetMajor || '—'}</td>
                <td className="py-6">
                  <Button variant="secondary" onClick={() => navigate(`/students/${s.studentId}`)}>
                    상세 보기
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
