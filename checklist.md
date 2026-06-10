# checklist

## 1주차 - 기본 세팅
- [x] feature/1: 프로젝트 초기 세팅
  - [x] CLAUDE.md 작성 (아키텍처 원칙, 디렉토리 구조, 컨벤션)
  - [x] 모노레포 구조 세팅 (client / server 디렉토리 분리) (npm, workspace 없이 폴더만 분리)
  - [x] Vite + React 프론트엔드 초기화
  - [x] Node.js + Express 백엔드 초기화
  - [x] npm install (client, server)
  - [x] MongoDB Atlas 연결 및 환경변수 설정 (.env, .gitignore) (mongoose, server=dotenv / client=Vite 내장)
  - [x] Express 기본 미들웨어 설정 (cors, json, error handler)
  - [x] 레이어드 아키텍처 디렉토리 구조 세팅 (routes / services / repositories / models)

---

## 2주차 — 백엔드

- [x] feature/2: Student 모델 및 기본 CRUD API
  - [x] Student Mongoose 스키마 정의 (name, grade, classNum, number, targetUniv, targetMajor)
  - [x] StudentRepository 구현 (findAll, findById, create, update, delete)
  - [x] StudentService 구현 (필터링, 유효성 검사)
    - [x] studentId 자동 생성 로직 (학년+반+번호 각 2자리 조합)
  - [x] Student CRUD API 라우터 구현 (POST, GET, PUT, DELETE)

- [x] feature/3: 내신 · 모의고사 데이터 API
  - [x] grades 서브도큐먼트 스키마 정의 (semester, subjects[], avgGrade) - 내신
  - [x] mockExams 서브도큐먼트 스키마 정의 (date, kor/math/eng/exp 각 grade+percentile) - 모의고사
  - [x] 학기별 평균 등급 자동 계산 로직 (Service)
  - [x] `PUT /api/students/:id/grades` 내신 저장·수정
  - [x] `PUT /api/students/:id/mock-exams` 모의고사 저장·수정

- [x] feature/4: Analysis 모델 및 OpenAI 연동 기반
  - [x] Analysis Mongoose 스키마 정의 (studentId, inputText 스냅샷, result{competencyProfile, diagnosis, activityA, activityB, narrative}, createdAt)
  - [x] AnalysisRepository 구현 (create, findByStudentId, findById)
  - [x] OpenAI 클라이언트 설정 (환경변수 OPENAI_API_KEY, OPENAI_MODEL)
  - [x] 프롬프트 템플릿 파일 분리 (prompts/{competencyProfile,diagnosis,activityA,activityB,narrative}.js)
  - [x] 내신·모의고사 데이터 프롬프트 주입 유틸 함수

- [x] feature/5: AI 5단계 분석 API
  - [x] competencyProfile 호출 및 JSON 파싱 (careerFitScore, continuityScore 등)
  - [x] diagnosis 호출 및 JSON 파싱 (summary, strengths, weaknesses, suggestedMajors)
  - [x] activityA 호출 및 JSON 파싱 (stable, intensive)
  - [x] activityB 호출 및 JSON 파싱 (differentiated, practical)
  - [x] narrative 호출 및 JSON 파싱 (narrative, ideas[6])
  - [x] Promise.all 병렬 호출 AnalysisService 구현
  - [x] 항목별 필수 JSON 키 누락 검증 로직
  - [x] 파싱 실패 시 해당 항목 독립 재시도 (최대 1회)
  - [x] `POST /api/students/:id/analyze` 분석 요청 및 결과 저장
  - [x] `GET /api/students/:id/analysis` 분석 이력 목록 (최신순)
  - [x] `GET /api/analysis/:id` 분석 결과 상세 조회

- [x] feature/6: Consultation 모델 및 상담 API
  - [x] Consultation Mongoose 스키마 정의 (studentId, analysisId?, consultedAt, type, content 등)
  - [x] ConsultationRepository 구현 (create, findByStudentId, update)
  - [x] ConsultationService 구현
  - [x] `GET /api/students/:id/consultations` 상담 이력 목록
  - [x] `POST /api/consultations` 상담 기록 생성 (analysisId 선택)
  - [x] `PUT /api/consultations/:id` 상담 기록 수정

---

## 2.5주차 — TypeScript 전환

- [x] refactor: TypeScript 전환 (server + client)
  - [x] server: `typescript`, `tsx`, `@types/node`, `@types/express`, `@types/cors` 설치
  - [x] server: `tsconfig.json` 작성
  - [x] server: `.js` → `.ts` 파일 확장자 변경 (22개)
  - [x] server: 타입 어노테이션 추가 (모델 인터페이스, 서비스, 레포지토리, 라우터)
  - [x] server: `package.json` 스크립트 수정 (`tsx` 실행)
  - [x] client: `typescript`, `@types/react`, `@types/react-dom` 설치
  - [x] client: `tsconfig.json` 작성
  - [x] client: `.jsx` → `.tsx` 파일 확장자 변경

---

## 3주차 — 프론트엔드 + 배포

- [ ] feature/7: 공통 UI 세팅 및 라우팅
  - [ ] React Router v6 라우팅 구성 (/, /students, /students/new, /students/:id)
  - [ ] 공통 레이아웃 컴포넌트 (Header, Layout)
  - [ ] API 클라이언트 모듈 세팅 (fetch 래퍼, baseURL, 에러 핸들링)
  - [ ] 공통 컴포넌트 — Button, Input, Modal, Badge
  - [ ] 디자인 토큰 적용 (색상, 폰트, 간격 — DESIGN.md 기준)

- [ ] feature/8: 학생 목록 · 등록 UI
  - [ ] 홈 페이지 (`/`) 서비스 소개 화면
  - [ ] 학생 목록 테이블 (이름·학년·반·번호·희망대학·희망학과·관리)
  - [ ] 학년·반 필터 드롭다운
  - [ ] 이름·번호 검색 인풋
  - [ ] 학번 정렬 및 페이지네이션
  - [ ] 학생 등록 폼 (`/students/new`) — 유효성 검사 포함

- [ ] feature/9: 학생 상세 — 기본정보 탭
  - [ ] 탭 레이아웃 컴포넌트 (기본정보 / 생기부 분석 / 상담 기록 / 대학 탐색)
  - [ ] 인적사항 카드 (이름·학년·반·번호·목표대학·목표계열) + 수정 폼
  - [ ] 내신 입력 팝업 — 학기 선택, 과목명·등급 행 추가/삭제
  - [ ] 내신 학기별 평균·전체 평균 자동 계산 표시
  - [ ] 모의고사 입력 팝업 — 연월 입력, 영역별 등급·백분위 입력
  - [ ] 내신 성적 테이블 렌더링
  - [ ] 모의고사 히스토리 테이블 렌더링

- [ ] feature/10: 학생 상세 — 생기부 분석 탭
  - [ ] 생기부 원문 텍스트에어리어 + 분석 시작 버튼
  - [ ] 5단계 진행 표시 로딩 UI (단계별 상태 표시)
  - [ ] 단계별 수동 재시도 버튼 (실패 시 노출)
  - [ ] 1단계 역량 프로필 — 레이더/바 차트 (4개 점수)
  - [ ] 2단계 종합 진단 — 강점·보완점·추천 전공 카드
  - [ ] 3·4단계 활동 추천 — 유형별 카드 (안정·심화·차별화·실천)
  - [ ] 5단계 서사 설계 — 서사 전략 텍스트 + 탐구 아이디어 6개
  - [ ] 분석 이력 목록 (최신순 셀렉트 or 드롭다운, 선택 시 결과 복원)

- [ ] feature/11: 학생 상세 — 상담 기록 탭
  - [ ] "이 분석으로 상담 시작" 버튼 → analysisId 연결된 상담 카드 초기화
  - [ ] 상담 작성 폼 (일시·유형·상담내용·학생반응·다음목표·다음상담일)
  - [ ] 유형 선택 드롭다운 (진로/학업/심리/기타)
  - [ ] 독립 상담 직접 기록 (analysisId 없이 작성)
  - [ ] 상담 이력 타임라인 (날짜순)
  - [ ] 각 상담 카드에 연결된 분석 버전 표시 및 링크

- [ ] feature/12: 학생 상세 — 대학 탐색 탭
  - [ ] AI 추천 대학·학과 카드 목록 (매칭률 표시)
  - [ ] 목표 대학 합격 가능성 분석 섹션
  - [ ] AI 입시 전략 팁 섹션

- [ ] feature/13: 배포
  - [ ] Vercel 프론트엔드 배포 설정 (GitHub 연동, 빌드 루트 설정)
  - [ ] Render 백엔드 배포 설정 (Start Command, PORT 환경변수)
  - [ ] MongoDB Atlas Network Access 설정 (0.0.0.0/0)
  - [ ] 환경변수 전체 점검 (OPENAI_API_KEY, OPENAI_MODEL, MONGODB_URI 등)
  - [ ] 환경변수 `OPENAI_MODEL`로 gpt-4o-mini ↔ gpt-4o 전환 확인
  - [ ] 배포 확인
