const GRADES = [1, 2, 3]
const CLASS_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const inputClass = 'text-sm text-on-surface bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 outline-none focus:border-primary w-40'

interface StudentFilterBarProps {
  selectedGrade: number | null
  selectedClassNum: number | null
  nameInput: string
  numberInput: string
  onGradeChange: (grade: number | null) => void
  onClassNumChange: (classNum: number | null) => void
  onNameChange: (name: string) => void
  onNumberChange: (number: string) => void
  onSearch: () => void
}

export default function StudentFilterBar({
  selectedGrade, selectedClassNum, nameInput, numberInput,
  onGradeChange, onClassNumChange, onNameChange, onNumberChange, onSearch,
}: StudentFilterBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="flex items-center gap-10 mb-8 bg-surface-container rounded-lg px-8 py-5">
      <div className="flex items-center gap-2">
        <select
          value={selectedGrade ?? ''}
          onChange={e => onGradeChange(e.target.value === '' ? null : Number(e.target.value))}
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
          onChange={e => onClassNumChange(e.target.value === '' ? null : Number(e.target.value))}
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
          onChange={e => onNumberChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="번호"
          className={inputClass}
        />
        <span className="text-sm font-bold text-primary">번</span>
      </div>

      <input
        type="text"
        value={nameInput}
        onChange={e => onNameChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="이름"
        className={`${inputClass} flex-1`}
      />

      <button
        onClick={onSearch}
        className="px-8 py-4 rounded text-sm font-semibold bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity"
      >
        검색
      </button>
    </div>
  )
}
