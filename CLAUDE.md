# CLAUDE.md

이 파일은 Claude Code가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 명령어

```bash
pnpm install      # 의존성 설치
pnpm dev          # 개발 서버 실행
pnpm build        # 빌드
pnpm lint         # 린트
pnpm typecheck    # 타입 체크
pnpm test         # 테스트
pnpm format       # 포맷팅
pnpm pre-commit   # 커밋 전 검사
```

## 프로젝트

프로젝트 개요, 기술 스택, 데이터 구조는 [project.md](apps/desktop/docs/project.md) 참조.

## 아키텍처

### 구조

- **Monorepo**: pnpm workspace, 메인 앱은 `apps/desktop/`
- **데이터**: 로컬 파일 시스템 (source of truth) + SQLite 캐시
- **상태 관리**: Valtio + React Query

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
- **state/**: 상태 관리 (React Query + Valtio)
- **repo/**: 데이터 페칭 (IPC 통신)
- **model/**: 도메인 모델, 비즈니스 로직
- **common/**: 공유 UI 컴포넌트

### 개발 패턴

- **모듈 독립성**: 모델 간 의존 금지
- **타입 안전성**: TypeScript strict 모드
- **ESLint**: `@voyl/eslint-plugin-voyl`로 아키텍처 제약 강제

## Agent 시스템

프로젝트는 Claude Code Agent 시스템을 사용합니다.

- 워크플로우: [.claude/WORKFLOW.md](.claude/WORKFLOW.md)
- Agent 정의: `.claude/agents/`
