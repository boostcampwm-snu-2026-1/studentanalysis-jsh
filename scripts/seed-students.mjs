const API_BASE = 'http://localhost:3000'

const students = [
  { name: '김민준', grade: 3, classNum: 2, number: 7, targetUniv: '서울대학교', targetMajor: '컴퓨터공학부' },
  { name: '이서연', grade: 2, classNum: 1, number: 12, targetUniv: '연세대학교', targetMajor: '경영학과' },
  { name: '박지훈', grade: 1, classNum: 3, number: 5, targetUniv: '고려대학교', targetMajor: '경제학과' },
  { name: '최유진', grade: 1, classNum: 4, number: 18, targetUniv: '성균관대학교', targetMajor: '소프트웨어학과' },
  { name: '정현우', grade: 2, classNum: 2, number: 9, targetUniv: '한양대학교', targetMajor: '기계공학부' },
  { name: '강민서', grade: 3, classNum: 4, number: 21, targetUniv: '이화여자대학교', targetMajor: '심리학과' },
  { name: '조도윤', grade: 1, classNum: 1, number: 3, targetUniv: '부산대학교', targetMajor: '전기공학과' },
  { name: '윤서아', grade: 2, classNum: 3, number: 14, targetUniv: '경희대학교', targetMajor: '간호학과' },
  { name: '장준혁', grade: 3, classNum: 2, number: 27, targetUniv: '중앙대학교', targetMajor: '미디어커뮤니케이션학부' },
  { name: '한지민', grade: 2, classNum: 8, number: 11, targetUniv: '서강대학교', targetMajor: '전자공학과' },
  { name: '오태윤', grade: 3, classNum: 9, number: 6, targetUniv: '한국외국어대학교', targetMajor: '영어통번역학부' },
  { name: '신가은', grade: 1, classNum: 9, number: 19, targetUniv: '건국대학교', targetMajor: '동물자원과학과' },
  { name: '임서준', grade: 3, classNum: 3, number: 22, targetUniv: '아주대학교', targetMajor: '의학과' },
  { name: '송하윤', grade: 2, classNum: 1, number: 25, targetUniv: '동국대학교', targetMajor: '법학과' },
  { name: '백예린', grade: 1, classNum: 3, number: 8, targetUniv: '홍익대학교', targetMajor: '시각디자인학과' },
  { name: '문재현', grade: 2, classNum: 1, number: 2, targetUniv: '인하대학교', targetMajor: '항공우주공학과' },
  { name: '권수빈', grade: 3, classNum: 7, number: 16, targetUniv: '숙명여자대학교', targetMajor: '화학과' },
  { name: '노지호', grade: 1, classNum: 6, number: 10, targetUniv: '전북대학교', targetMajor: '수의예과' },
  { name: '허다은', grade: 2, classNum: 5, number: 29, targetUniv: '부경대학교', targetMajor: '해양생명과학과' },
  { name: '유승민', grade: 3, classNum: 8, number: 1, targetUniv: '충남대학교', targetMajor: '행정학과' },
  { name: '황서준', grade: 1, classNum: 9, number: 24, targetUniv: '경북대학교', targetMajor: '산업공학과' },
  { name: '전민지', grade: 2, classNum: 1, number: 15, targetUniv: '부산외국어대학교', targetMajor: '일본어융합학부' },
  { name: '서준호', grade: 3, classNum: 9, number: 4, targetUniv: '서울시립대학교', targetMajor: '도시행정학과' },
  { name: '배지우', grade: 1, classNum: 3, number: 20, targetUniv: '국민대학교', targetMajor: '경영정보학부' },
  { name: '안서현', grade: 2, classNum: 2, number: 13, targetUniv: '숭실대학교', targetMajor: '정보통계보험수리학과' },
  { name: '홍준표', grade: 3, classNum: 4, number: 23, targetUniv: '세종대학교', targetMajor: '호텔관광경영학과' },
  { name: '고은채', grade: 1, classNum: 7, number: 17, targetUniv: '가천대학교', targetMajor: '생명과학과' },
  { name: '문승현', grade: 2, classNum: 6, number: 28, targetUniv: '인천대학교', targetMajor: '무역학부' },
  { name: '남예진', grade: 3, classNum: 5, number: 30, targetUniv: '한성대학교', targetMajor: 'IT응용시스템공학과' },
  { name: '이도현', grade: 1, classNum: 8, number: 26, targetUniv: '덕성여자대학교', targetMajor: '국어국문학과' },
]

// 기존 데이터 전체 삭제
console.log('기존 학생 데이터 삭제 중...')
const existing = await fetch(`${API_BASE}/api/students`).then(r => r.json())
for (const s of existing.data ?? []) {
  await fetch(`${API_BASE}/api/students/${s.studentId}`, { method: 'DELETE' })
}
console.log(`${existing.data?.length ?? 0}명 삭제 완료\n`)

let success = 0
let fail = 0

for (const student of students) {
  try {
    const res = await fetch(`${API_BASE}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    })
    const json = await res.json()
    if (res.ok) {
      console.log(`✓ ${student.name} (${json.data?.studentId})`)
      success++
    } else {
      console.error(`✗ ${student.name}: ${json.error}`)
      fail++
    }
  } catch (e) {
    console.error(`✗ ${student.name}: ${e.message}`)
    fail++
  }
}

console.log(`\n완료: ${success}명 삽입, ${fail}명 실패`)
