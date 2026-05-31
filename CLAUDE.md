# CLAUDE.md

## 프로젝트 개요
고등학생 생기부 AI 분석 및 상담 관리 웹 서비스.
담임/담당 교사가 학생 데이터를 입력하면 OpenAI API로 5단계 분석을 수행하고 상담 기록을 관리한다.

## 디렉토리 구조

```
studentanalysis-jsh/
├── client/          # Vite + React 프론트엔드
│   ├── src/
│   │   ├── components/   # 공통 UI 컴포넌트
│   │   ├── pages/        # 라우트별 페이지 컴포넌트
│   │   ├── hooks/        # 커스텀 훅
│   │   ├── api/          # fetch 래퍼, API 클라이언트
│   │   └── utils/        # 순수 유틸 함수
│   ├── .env              # VITE_ 접두사 변수만 (브라우저 노출됨)
│   └── package.json
│
├── server/          # Node.js + Express 백엔드
│   ├── src/
│   │   ├── routes/       # Express 라우터
│   │   ├── services/     # 비즈니스 로직
│   │   ├── repositories/ # DB 접근 (Mongoose 쿼리)
│   │   ├── models/       # Mongoose 스키마
│   │   ├── prompts/      # OpenAI 프롬프트 템플릿
│   │   └── index.js      # 앱 진입점
│   ├── .env              # 민감 환경변수 (API 키 등)
│   └── package.json
│
├── checklist.md
└── CLAUDE.md
```

## 아키텍처 원칙

### 레이어드 아키텍처 (server)
- **routes** → **services** → **repositories** → **models** 단방향 의존
- routes: 요청 파싱, 응답 직렬화만. 비즈니스 로직 없음
- services: 비즈니스 로직, 유효성 검사, OpenAI 호출
- repositories: Mongoose 쿼리만. 비즈니스 로직 없음
- models: Mongoose 스키마 정의만

### 환경변수
- server: `dotenv`로 `server/.env` 로드. `MONGODB_URI`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORT`
- client: Vite 내장. `VITE_` 접두사 변수만 브라우저에 노출됨. `VITE_API_BASE_URL`
- **API 키는 절대 client `.env`에 넣지 않는다**

### 패키지 관리
- npm 사용. workspace 없이 client/server 각각 독립 `package.json`
- client, server 각 디렉토리에서 별도로 `npm install`

## 컨벤션

### 공통
- 파일명: camelCase (JS 파일), kebab-case (설정 파일)
- 변수/함수: camelCase
- 상수: UPPER_SNAKE_CASE
- 클래스/컴포넌트: PascalCase

### API 응답 형식 (server)
```json
{ "data": { ... } }          // 성공
{ "error": "메시지" }        // 실패
```

### 브랜치 전략
- `main`: 배포 브랜치
- `dev`: 통합 브랜치
- `feature/[이슈번호]-[기능명]`: 기능 개발 브랜치 → dev로 PR
