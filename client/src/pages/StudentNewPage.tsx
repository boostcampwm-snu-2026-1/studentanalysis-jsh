import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import Input from '../components/Input'
import Button from '../components/Button'

interface FormState {
  name: string
  grade: string
  classNum: string
  number: string
  targetUniv: string
  targetMajor: string
}

interface FormErrors {
  name?: string
  grade?: string
  classNum?: string
  number?: string
}

const INITIAL_FORM: FormState = { name: '', grade: '', classNum: '', number: '', targetUniv: '', targetMajor: '' }

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = '이름을 입력해주세요'
  const grade = Number(form.grade)
  if (!form.grade) errors.grade = '학년을 입력해주세요'
  else if (!Number.isInteger(grade) || grade < 1 || grade > 3) errors.grade = '학년은 1~3 사이여야 합니다'
  const classNum = Number(form.classNum)
  if (!form.classNum) errors.classNum = '반을 입력해주세요'
  else if (!Number.isInteger(classNum) || classNum < 1 || classNum > 9) errors.classNum = '반은 1~9 사이여야 합니다'
  const number = Number(form.number)
  if (!form.number) errors.number = '번호를 입력해주세요'
  else if (!Number.isInteger(number) || number < 1 || number > 99) errors.number = '번호는 1~99 사이여야 합니다'
  return errors
}

export default function StudentNewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
    setServerError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitting(true)
    try {
      const res = await client.post('/api/students', {
        name: form.name.trim(),
        grade: Number(form.grade),
        classNum: Number(form.classNum),
        number: Number(form.number),
        targetUniv: form.targetUniv.trim(),
        targetMajor: form.targetMajor.trim(),
      })
      const studentId = (res as any).data?.studentId
      navigate(`/students/${studentId}`)
    } catch (err) {
      setServerError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-base font-semibold text-on-surface mb-8">학생 등록</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 flex flex-col gap-6">
          <Input label="이름" value={form.name} onChange={handleChange('name')} placeholder="홍길동" error={errors.name} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="학년" value={form.grade} onChange={handleChange('grade')} placeholder="1~3" type="number" error={errors.grade} />
            <Input label="반" value={form.classNum} onChange={handleChange('classNum')} placeholder="1~9" type="number" error={errors.classNum} />
            <Input label="번호" value={form.number} onChange={handleChange('number')} placeholder="1~99" type="number" error={errors.number} />
          </div>
          <Input label="희망 대학 (선택)" value={form.targetUniv} onChange={handleChange('targetUniv')} placeholder="서울대학교" />
          <Input label="희망 학과 (선택)" value={form.targetMajor} onChange={handleChange('targetMajor')} placeholder="컴퓨터공학부" />
        </div>

        {serverError && <p className="text-sm text-error mt-4">{serverError}</p>}

        <div className="flex gap-3 mt-6">
          <Button type="submit" disabled={submitting}>
            {submitting ? '등록 중...' : '등록하기'}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/students')}>
            취소
          </Button>
        </div>
      </form>
    </div>
  )
}
