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

프로젝트는 Claude Code Agent 시스템을 사용합니다. 작업 요청 시 아래 워크플로우에 따라 적절한 Agent를 **Task tool로 직접 호출**합니다.

- Agent 정의: `.claude/agents/`

### 작업 유형 판단

1. **library-migration**: 라이브러리 교체/업그레이드
2. **new-feature**: 새로운 기능 개발
3. **bug-fix**: 버그 수정
4. **refactoring**: 구조 개선, 코드 정리
5. **feature-modification**: 기존 기능 수정/삭제
6. **documentation**: 문서 정리, 인덱싱

### 워크플로우별 Agent 호출 순서

#### 라이브러리 마이그레이션
```
1. code-analyzer  → 현재 사용 현황 분석
2. researcher     → 새 라이브러리 베스트 프랙티스 조사 (선택)
3. 해당 generator → 실제 마이그레이션
4. tester         → 검증 (typecheck, lint, build)
5. doc-updater    → 문서 동기화 (용어/기술 스택 업데이트)
6. refactor       → 코드 정리 (선택)
```

#### 새 기능 개발
```
1. code-analyzer     → 관련 코드/패턴 분석 (선택)
2. architect         → 아키텍처 설계 (복잡한 경우)
3. common-generator  → 공통 타입/유틸 (필요 시)
4. be-* generators   → Backend (repo → model → ipc)
5. fe-* generators   → Frontend (repo → model → state → page)
6. tester            → 검증
7. refactor          → 코드 정리 (선택)
```

#### 버그 수정
```
1. bug-analyzer   → 근본 원인 분석
2. 해당 generator → 수정 구현
3. tester         → 검증
```

#### 리팩토링
```
1. code-analyzer → 현재 상태 분석
2. refactor      → 리팩토링 실행
3. tester        → 검증
```

#### 기능 수정/삭제
```
1. code-analyzer  → 영향 범위 분석
2. 해당 generator → 구현
3. tester         → 검증
```

#### 문서 작업
```
1. doc-updater   → 코드 변경 후 용어/참조 동기화
2. doc-compiler  → 인덱스 갱신 + 문서 정리
```

### 사용 가능한 Agent

| 분류 | Agent | 역할 |
|------|-------|------|
| **분석** | code-analyzer | 코드 분석, 의존성 추적 |
| | bug-analyzer | 버그 원인 분석 |
| | researcher | 대안 탐색, 베스트 프랙티스 조사 |
| **설계** | architect | 아키텍처 설계 |
| | planner | 작업 계획 수립 |
| | spec-writer | 기술 명세 작성 |
| **공통** | common-generator | 타입, 유틸, 상수 |
| | tester | 타입체크, 린트, 테스트 |
| | refactor | 코드 정리, 패턴 일관성 |
| | doc-updater | 코드 변경 후 용어/참조 동기화 |
| | doc-compiler | 인덱스 갱신, 문서 정리 |
| | git-agent | 브랜치, 커밋, PR |
| **Frontend** | fe-page-generator | Page 레이어 |
| | fe-state-generator | State 레이어 |
| | fe-model-generator | Model 레이어 |
| | fe-repo-generator | Repo 레이어 |
| **Backend** | be-ipc-generator | IPC 레이어 |
| | be-model-generator | Model 레이어 |
| | be-repo-generator | Repo 레이어 |
| **메타** | system-improver | Agent 시스템 개선 |

### 검증 실패 시

1. 실패 원인 파악 (타입 에러, 린트 에러 등)
2. 해당 generator 재호출로 수정
3. 3회 실패 시 사용자에게 보고
