import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStudents from '../hooks/useStudents'
import Button from '../components/Button'
import StudentFilterBar from '../components/StudentFilterBar'
import StudentTable from '../components/StudentTable'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 20

export default function StudentListPage() {
  const navigate = useNavigate()
  const { students, loading, error } = useStudents()
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedClassNum, setSelectedClassNum] = useState<number | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [numberInput, setNumberInput] = useState('')
  const [appliedName, setAppliedName] = useState('')
  const [appliedNumber, setAppliedNumber] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  if (loading) return <p className="text-sm text-on-surface-variant py-10 text-center">불러오는 중...</p>
  if (error) return <p className="text-sm text-error py-10 text-center">{error}</p>

  const applySearch = () => {
    setAppliedName(nameInput.trim())
    setAppliedNumber(numberInput.trim())
    setCurrentPage(1)
  }

  const filtered = students
    .filter(s => {
      if (selectedGrade !== null && s.grade !== selectedGrade) return false
      if (selectedClassNum !== null && s.classNum !== selectedClassNum) return false
      if (appliedName && !s.name.includes(appliedName)) return false
      if (appliedNumber && s.number !== Number(appliedNumber)) return false
      return true
    })
    .sort((a, b) =>
      sortOrder === 'asc'
        ? a.studentId.localeCompare(b.studentId)
        : b.studentId.localeCompare(a.studentId)
    )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-base font-semibold text-on-surface">학생 목록</h2>
        <Button onClick={() => navigate('/students/new')}>학생 등록</Button>
      </div>

      <StudentFilterBar
        selectedGrade={selectedGrade}
        selectedClassNum={selectedClassNum}
        nameInput={nameInput}
        numberInput={numberInput}
        onGradeChange={grade => { setSelectedGrade(grade); setSelectedClassNum(null); setCurrentPage(1) }}
        onClassNumChange={classNum => { setSelectedClassNum(classNum); setCurrentPage(1) }}
        onNameChange={setNameInput}
        onNumberChange={setNumberInput}
        onSearch={applySearch}
      />

      <StudentTable
        students={paginated}
        sortOrder={sortOrder}
        onSortToggle={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={page => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      />
    </div>
  )
}
