# studentanalysis-jsh

> 교사가 학생 생기부를 입력하면 AI가 학생부종합전형 기준으로 다단계 분석을 제공하는 웹 서비스

---

## 서비스 소개

고등학교 교사(담임·진로 담당)가 학생의 생활기록부를 텍스트로 입력하면, AI가 실제 학생부종합전형 평가 기준에 따라 5단계 분석을 수행하고, 그 결과를 분석 이력으로 누적해 확인할 수 있는 웹 서비스입니다.

### 핵심 사용 흐름

```
학생 등록 → 학생 목록 조회 → 학생 상세 진입
  → 생기부 원문(진로활동특기사항, 700자 이내) + 내신 + 모의고사 입력
  → AI 5단계 분석 요청
  → 역량 점수 · 종합 진단 · 추천 활동 · 서사 전략 확인
  → 분석 이력 누적 (이전 분석 결과 드롭다운으로 복원)
```

> 상담 기록 관리는 백엔드 API까지만 구현되어 있고, 현재 UI에는 노출되지 않습니다.

---

## 기술 스택

| 구분 | 선택 |
|---|---|
| Frontend | React + Vite + **TypeScript** |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Backend | Node.js + Express + **TypeScript** |
| DB | MongoDB Atlas (Mongoose) |
| AI | Groq API (`llama-3.3-70b-versatile`, OpenAI SDK 호환) |
| 배포 | Vercel (FE) + Render (BE) |

---

## 주요 기능

### 학생 관리
- 학생 등록: 이름, 학년(1~3), 반, 번호, 목표 대학, 목표 계열
- 학생 목록: 학년·반·번호·이름 필터, 학번 정렬, 페이지네이션
- 학생 상세: **기본 정보 / 생기부 분석** 탭 구성

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
- JSON 키 누락·파싱 실패·한국어 외 문자 혼입 시 해당 항목만 자동 재시도
- 재시도 실패 시 수동 재시도 버튼 노출
- `competencyProfile` 점수는 입력 텍스트에 전국·지역 단위 수상/논문/특허 등 외부 인정 근거가 없으면 84점을 넘지 않도록 서버에서 보정

### 상담 기록 (백엔드 API만 구현, UI 미구현)
- 학생별 상담 이력 조회, 상담 기록 생성·수정 API 제공
- 분석 결과(analysisId)와 선택적으로 연결 가능
- 상담 기록 탭 UI는 별도 구현하지 않기로 결정함

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
| GET | `/api/students/:studentId/analysis` | 분석 이력 목록 (최신순) |
| POST | `/api/students/:studentId/analysis/init` | 분석 레코드 생성 (생기부 원문 저장) |
| POST | `/api/analysis/:analysisId/step` | 항목별 분석 실행 (`step`: competencyProfile\|diagnosis\|activityA\|activityB\|narrative) |
| GET | `/api/analysis/:id` | 분석 결과 상세 |

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
GROQ_API_KEY=your_groq_api_key
OPENAI_MODEL=llama-3.3-70b-versatile
PORT=3000
```

**`client/.env`**
```
VITE_API_BASE_URL=http://localhost:3000
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
        ├── feature/이슈번호-기능명
        └── refactor/기능명
```

- 기능 개발: `feature/이슈번호-기능명` 브랜치
- 리팩토링: `refactor/기능명` 브랜치
- `feature/*`, `refactor/*` → `dev` PR 후 머지
- 배포 시점에 `dev` → `main` PR 후 머지

---

## Task 관리

- GitHub Issue로 기능 단위 Task 등록
- 라벨: `feature` / `bug` / `docs` / `infra`
- feature 브랜치는 이슈 번호 포함, refactor 브랜치는 이슈 번호 없이 기능명만
