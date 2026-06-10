# studentanalysis-jsh

> 교사가 학생 생기부를 입력하면 AI가 다단계로 분석하고, 결과를 기반으로 상담까지 이어지는 웹 서비스

---

## 서비스 소개

고등학교 교사(담임·진로 담당)가 학생의 생활기록부를 텍스트로 입력하면, OpenAI API가 실제 학생부종합전형 평가 기준에 따라 5단계 분석을 수행하고, 그 결과를 기반으로 상담 기록까지 통합 관리할 수 있는 웹 서비스입니다.

### 핵심 사용 흐름

```
학생 등록 → 학생 목록 조회 → 학생 상세 진입
  → 생기부 원문 + 내신 + 모의고사 입력
  → AI 5단계 분석 요청
  → 역량 점수 · 추천 활동 · 서사 전략 · 대학 적합도 확인
  → 분석 이력 누적
  → "이 분석으로 상담 시작" → 상담 카드 작성 → 상담 이력 관리
```

---

## 기술 스택

| 구분 | 선택 |
|---|---|
| Frontend | React + Vite |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| DB | MongoDB Atlas |
| AI | OpenAI API (`gpt-4o-mini` / `gpt-4o`) |
| 배포 | Vercel (FE) + Render (BE) |

---

## 주요 기능

### 학생 관리
- 학생 등록: 이름, 학년(1~3), 반, 번호, 목표 대학, 목표 계열
- 학생 목록: 학년·반·번호·이름 필터, 페이지네이션
- 학생 상세: **기본 정보 / 생기부 분석 / 상담 기록 / 대학 탐색** 탭 구성

### 내신 · 모의고사 입력
- 내신: 학기별(1-1 ~ 3-2) 과목·등급 입력, 평균 자동 계산
- 모의고사: 회차별(연월) 국·수·영·탐 등급 + 백분위 입력

### 생기부 AI 5단계 분석 (병렬 처리)

| 항목 (result 필드) | 내용 |
|---|---|
| `competencyProfile` | 진로적합성·탐구연속성·서사일관성·심화잠재력 0~100점 + 근거 서술 |
| `diagnosis` | 활동 요약·강점 3개·보완점 3개·추천 전공 3~5개 |
| `activityA` | 안정형(기존 활동 연장) + 심화형(희망 전공 심층 탐구) |
| `activityB` | 차별화형(독창적 문제의식) + 실천형(측정·실험·인터뷰 등) |
| `narrative` | 학생부 서사 전략(430~470자) + 추가 탐구 아이디어 6개 |

- 5개 항목 Promise.all 병렬 호출
- JSON 키 누락·파싱 실패 시 해당 항목만 자동 재시도 (최대 1회)
- 재시도 실패 시 수동 재시도 버튼 노출

### 상담 기록
- 분석 결과에서 "이 분석으로 상담 시작" → 상담 카드 자동 생성
- 기록 항목: 상담 일시, 유형(진로/학업/심리/기타), 내용, 학생 반응, 다음 목표, 다음 상담 날짜
- 날짜순 타임라인, 분석 버전 연결 표시
- 분석과 무관한 독립 상담 기록도 지원

---

## 백엔드 아키텍처

```
Router (요청/응답)
  → Service (비즈니스 로직)
  → Repository (DB 접근)
  → Model (Mongoose Schema)
```

---

## API 엔드포인트

### 학생
| Method | Path | 설명 |
|---|---|---|
| GET | `/api/students` | 학생 목록 (grade, classNum 필터) |
| POST | `/api/students` | 학생 등록 |
| GET | `/api/students/:id` | 학생 상세 |
| PUT | `/api/students/:id` | 학생 정보 수정 |
| DELETE | `/api/students/:id` | 학생 삭제 |

### 분석
| Method | Path | 설명 |
|---|---|---|
| POST | `/api/students/:id/analyze` | 생기부 분석 요청 (5단계 병렬) |
| GET | `/api/students/:id/analyses` | 분석 이력 목록 |
| GET | `/api/analyses/:id` | 분석 결과 상세 |

### 상담
| Method | Path | 설명 |
|---|---|---|
| GET | `/api/students/:id/consultations` | 상담 이력 목록 |
| POST | `/api/consultations` | 상담 기록 생성 |
| PUT | `/api/consultations/:id` | 상담 기록 수정 |

---

## 로컬 실행 방법

### 환경변수 설정

**`server/.env`**
```
MONGODB_URI=your_mongodb_atlas_uri
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
DEFAULT_TEACHER_ID=your_teacher_object_id
PORT=5000
```

**`client/.env`**
```
VITE_API_URL=http://localhost:5000
```

### 설치 및 실행

```bash
# 백엔드
cd server
npm install
npm run dev

# 프론트엔드 (새 터미널)
cd client
npm install
npm run dev
```

---

## 브랜치 전략

```
main       ← 배포용
  └── dev  ← 개발 통합
        ├── feature/1-student-crud
        ├── feature/2-openai-analyze
        └── feature/3-consultation-record
```

- 기능 하나 = `feature/이슈번호-기능명` 브랜치
- `feature/*` → `dev` PR 후 머지
- 배포 시점에 `dev` → `main` PR 후 머지

---

## Task 관리

- GitHub Issue로 기능 단위 Task 등록
- 라벨: `feature` / `bug` / `docs`
- 브랜치 이름에 이슈 번호 포함
