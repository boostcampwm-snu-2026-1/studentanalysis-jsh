---
name: push
description: push 단계를 진행합니다. feature의 모든 하위 항목이 완료되면 push · PR 생성 · 브랜치 삭제를 안내합니다. /workflow에서 자동 호출됩니다.
depends_on: [commit]
---

# Push 단계

## 목적
feature의 모든 하위 항목 구현이 끝났을 때, 원격에 push하고 PR을 생성한 뒤 브랜치를 정리한다.
브랜치·커밋·PR은 사용자가 직접 실행한다.

## 절차

### 1. 완료 요약
이번 feature에서 작업한 하위 항목 전체와 주요 변경 파일을 정리해서 보여준다.

```
## feature 완료 요약
- feature: [feature 항목명]
- 완료된 하위 항목:
  - [x] [항목1]
  - [x] [항목2]
- 주요 변경 파일: [파일 목록]
```

### 2. checklist.md 최상위 항목 업데이트
해당 feature의 최상위 항목을 `- [ ]` 에서 `- [x]` 로 변경한다.

### 3. push 안내
사용자에게 아래 명령어를 보여주고 직접 실행하도록 안내한다:

```
git push -u origin [현재 브랜치명]
```

### 4. PR 생성 안내
push 완료 후 GitHub에서 아래 방향으로 PR을 생성하도록 안내한다:

```
feature/[이슈번호]-[기능명] → dev
```

PR 제목은 feature 항목명 기준으로 제안해준다.

### 5. 브랜치 삭제 안내
PR 머지 후 아래 명령어로 로컬 브랜치를 삭제하도록 안내한다:

```
git branch -d feature/[이슈번호]-[기능명]
```

원격 브랜치는 GitHub PR 머지 시 "Delete branch" 버튼으로 삭제하도록 안내한다.

## 완료 조건
브랜치 삭제까지 완료되면 이 workflow가 종료된다.
