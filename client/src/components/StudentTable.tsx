import { useNavigate } from 'react-router-dom'
import Button from './Button'
import { Student } from '../hooks/useStudents'

interface StudentTableProps {
  students: Student[]
  sortOrder: 'asc' | 'desc'
  onSortToggle: () => void
}

export default function StudentTable({ students, sortOrder, onSortToggle }: StudentTableProps) {
  const navigate = useNavigate()

  return (
    <table className="w-full border-collapse table-fixed">
      <colgroup>
        <col className="w-14" />
        <col className="w-14" />
        <col className="w-14" />
        <col className="w-12" />
        <col className="w-12" />
        <col className="w-20" />
        <col className="w-20" />
        <col className="w-20" />
      </colgroup>
      <thead>
        <tr className="border-b border-outline-variant">
          <th
            className="text-left text-xs font-semibold text-on-surface-variant py-3 pr-6 cursor-pointer select-none hover:text-on-surface"
            onClick={onSortToggle}
          >
            학번 {sortOrder === 'asc' ? '▲' : '▼'}
          </th>
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
            <td colSpan={8} className="text-sm text-on-surface-variant text-center py-10">
              해당하는 학생이 없습니다.
            </td>
          </tr>
        ) : (
          students.map(s => (
            <tr key={s.studentId} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
              <td className="text-sm text-on-surface py-6 pr-6">{s.studentId}</td>
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
  )
}
