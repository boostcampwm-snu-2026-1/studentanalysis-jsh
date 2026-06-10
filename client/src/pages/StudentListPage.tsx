import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStudents from '../hooks/useStudents'
import Button from '../components/Button'

const GRADES = [1, 2, 3]
const CLASS_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const inputClass = 'text-sm text-on-surface bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 outline-none focus:border-primary w-40'

export default function StudentListPage() {
  const navigate = useNavigate()
  const { students, loading, error } = useStudents()
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedClassNum, setSelectedClassNum] = useState<number | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [numberInput, setNumberInput] = useState('')
  const [appliedName, setAppliedName] = useState('')
  const [appliedNumber, setAppliedNumber] = useState('')

  if (loading) return <p className="text-sm text-on-surface-variant py-10 text-center">불러오는 중...</p>
  if (error) return <p className="text-sm text-error py-10 text-center">{error}</p>

  const applySearch = () => {
    setAppliedName(nameInput.trim())
    setAppliedNumber(numberInput.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') applySearch()
  }

  const filtered = students.filter(s => {
    if (selectedGrade !== null && s.grade !== selectedGrade) return false
    if (selectedClassNum !== null && s.classNum !== selectedClassNum) return false
    if (appliedName && !s.name.includes(appliedName)) return false
    if (appliedNumber && s.number !== Number(appliedNumber)) return false
    return true
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-base font-semibold text-on-surface">학생 목록</h2>
        <Button onClick={() => navigate('/students/new')}>학생 등록</Button>
      </div>

      <div className="flex items-center gap-10 mb-8 bg-surface-container rounded-lg px-8 py-5">
        <div className="flex items-center gap-2">
          <select
            value={selectedGrade ?? ''}
            onChange={e => {
              setSelectedGrade(e.target.value === '' ? null : Number(e.target.value))
              setSelectedClassNum(null)
            }}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">전체 학년</option>
            {GRADES.map(g => <option key={g} value={g}>{g}학년</option>)}
          </select>
          <span className="text-sm font-bold text-primary">학년</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedClassNum ?? ''}
            onChange={e => setSelectedClassNum(e.target.value === '' ? null : Number(e.target.value))}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">전체 반</option>
            {CLASS_NUMS.map(c => <option key={c} value={c}>{c}반</option>)}
          </select>
          <span className="text-sm font-bold text-primary">반</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={numberInput}
            onChange={e => setNumberInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="번호"
            className={inputClass}
          />
          <span className="text-sm font-bold text-primary">번</span>
        </div>

        <input
          type="text"
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="이름"
          className={`${inputClass} flex-1`}
        />

        <Button onClick={applySearch}>검색</Button>
      </div>

      <table className="w-full border-collapse table-fixed">
        <colgroup>
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
            {['이름', '학년', '반', '번호', '희망대학', '희망학과', '관리'].map(col => (
              <th key={col} className="text-left text-xs font-semibold text-on-surface-variant py-3 pr-6">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-sm text-on-surface-variant text-center py-10">
                해당하는 학생이 없습니다.
              </td>
            </tr>
          ) : (
            filtered.map(s => (
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
