# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 명령어

### 개발
```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버 실행
pnpm build        # 빌드
pnpm lint         # 린트
pnpm typecheck    # 타입 체크
pnpm test         # 테스트
```

### 데스크톱 앱
```bash
pnpm build:win    # Windows 빌드
pnpm build:mac    # macOS 빌드
pnpm build:linux  # Linux 빌드
pnpm format       # 포맷팅
pnpm pre-commit   # 커밋 전 검사
```

## 아키텍처

Voyl은 계층적 노드 관리를 위한 Electron 기반 데스크톱 앱입니다.

### 핵심 구조
- **Monorepo**: pnpm workspace, 메인 앱은 `apps/desktop/`
- **스택**: React 19 + TypeScript + Vite + Electron
- **데이터**: 로컬 파일 시스템 (source of truth) + SQLite 캐시
- **상태 관리**: Zustand + React Query

### 디렉토리

자세한 레이어 구조 및 의존성 규칙은 [Layer Guide](apps/desktop/docs/guide/layer/index.md) 참조.

#### `/apps/desktop/src/main/` - Main Process
- **repo/**: Repository (파일시스템 + SQLite, Drizzle ORM)
- **model/**: 도메인 모델, 비즈니스 로직
- **ipc/**: IPC 핸들러
- **window/**: 윈도우 관리
- **common/**: 공유 유틸리티

#### `/apps/desktop/src/renderer/` - Renderer Process
- **page/**: UI 페이지
- **store/**: 상태 관리 (React Query + Zustand)
- **repo/**: 데이터 페칭 (IPC 통신)
- **model/**: 도메인 모델, 비즈니스 로직
- **common/**: 공유 UI 컴포넌트

### Agent System

프로젝트는 Claude Code Agent 시스템을 사용합니다.
- Agent 정의: `.claude/agents/`
- 워크플로우: [orchestrator.md](.claude/agents/orchestrator.md) 참조

### 기술 스택
- **UI**: React 19, Tailwind CSS, Shadcn UI, Lucide icons
- **데이터**: better-sqlite3, Drizzle ORM, React Query
- **상태**: Zustand
- **DX**: Vite, TypeScript, ESLint, Prettier, Vitest
- **데스크톱**: Electron + electron-vite

### 개발 패턴
- **모듈 독립성**: 모델 간 의존 금지
- **타입 안전성**: TypeScript strict 모드
- **테스트**: Vitest, React Testing Library

### 주요 파일
- **PRD**: `docs/PRD.md`
- **워크스페이스 구조**: `nodes/`, `content/`, `log/` 하위 디렉토리

### ESLint 규칙
`@voyl/eslint-plugin-voyl`로 아키텍처 제약 및 코딩 표준 강제.
