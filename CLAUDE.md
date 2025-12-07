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

프로젝트는 Claude Code Agent 시스템을 사용합니다. 오케스트레이터(메인 Claude)가 작업을 조율하고, Agent들을 **Task tool로 호출**합니다.

- Agent 정의: `.claude/agents/`

### 오케스트레이터 역할

**반드시 워크플로우 단계를 순서대로 따라야 함**. 단계를 건너뛰거나 직접 수행하지 말고 해당 Agent를 호출할 것.

#### 필수 규칙

1. **Whiteboard 초기화**: research-planner 호출 전에 오케스트레이터가 직접 `context.md` 생성
   - 작업 배경, 목표, 제약사항 명시
   - Agent들은 context.md를 생성하지 않음

2. **planner 필수 호출**: 계획 수립 단계에서 반드시 planner Agent 호출
   - 오케스트레이터가 직접 계획 세우지 말 것
   - 단순한 작업이어도 planner가 구조화된 계획 생성

3. **병렬 실행 우선**: 의존성 없는 generator들은 동시에 호출
   - 예: Backend 완료 후 Frontend 3개 generator 병렬 호출
   - 직렬로만 하면 느려짐

4. **마무리 자동 실행**: 작업 완료 후 사용자 요청 없이 자동으로 마무리 단계 진행
   - doc-updater → doc-compiler: 직렬 (문서 수정 → 인덱스 갱신)
   - retrospector: doc-updater와 병렬 가능 (워크플로우 회고는 문서 변경과 무관)

### 워크플로우

**핵심 원칙**: 실행 전에 모호함을 모두 제거해야 함

```
1. 정보 수집 & 분석
   [오케스트레이터] Whiteboard 초기화
     → apps/desktop/docs/whiteboard/{task-dir}/context.md 생성

   [Task] research-planner 호출 (필수)
     → 사용자 요구사항 상세화 포함
     → 계획에 따라 리서처들 호출

   [Task] bug-analyzer / feature-analyzer
     → Needs More Research → research-planner 재호출
     → Needs User Decision → 오케스트레이터가 질문
     → 실행 준비 완료 → 다음 단계

2. 전략 검토
   [오케스트레이터] analyzer가 제안한 전략 검토
   [오케스트레이터] 사용자 확인 필요시 질문
   [오케스트레이터] architect 필요 여부 판단
     → 추가 정보 필요 시 1단계로 복귀 (research-planner 재호출)

3. 설계 (복잡한 경우)
   [Task] architect 호출
     → Needs More Research → research-planner 재호출
     → Needs User Decision → 오케스트레이터가 질문
     → 실행 준비 완료 → 다음 단계

4. 계획 수립 (필수)
   [Task] planner 호출
     → Needs More Research → research-planner 재호출
     → Needs User Decision → 오케스트레이터가 질문
     → 실행 준비 완료 → 다음 단계

5. 작업 (모호함 제거 후에만 진입)
   [Task] planner 계획에 따라 generator 호출
     → 의존성 없는 generator들은 병렬로 호출

   [Task] tester로 검증
     → 실패 시 해당 generator 재호출 (최대 3회)

6. 마무리 (자동 실행)
   [Task] doc-updater → doc-compiler (직렬)
   [Task] retrospector (doc-updater와 병렬)
```

### 작업 유형별 참고

| 작업 유형 | analyzer | 비고 |
|-----------|----------|------|
| 버그 수정 | bug-analyzer | - |
| 기능 추가/수정/삭제 | feature-analyzer | 복잡하면 architect 추가 |
| 리팩토링 | feature-analyzer | - |

### Whiteboard

`apps/desktop/docs/whiteboard/{task-dir}/` - 진행 중인 논의, 아이디어, 맥락

- `{task-dir}`: `YYYYMMDDTHHMM-task-name` 형식 (예: `20251130T1530-logger-source-location`)
- 상세 구조: [whiteboard/index.md](apps/desktop/docs/whiteboard/index.md) 참조

### 사용 가능한 Agent

> 상세 정의는 `.claude/agents/` 참조

| 분류         | Agent              | 역할                            |
| ------------ | ------------------ | ------------------------------- |
| **리서치**   | research-planner   | **리서치 전문가** (단일 진입점)  |
|              | code-researcher    | 코드 분석, 다층 분석            |
|              | web-researcher     | 웹 검색, 공식 문서              |
|              | doc-researcher     | 프로젝트 문서, 과거 의사결정     |
|              | git-researcher     | git 히스토리, 변경 맥락          |
|              | runtime-researcher | DevTools MCP, 런타임 상태       |
| **분석**     | bug-analyzer       | 리서처 결과 종합, 근본 원인 도출 |
|              | feature-analyzer   | 리서처 결과 종합, 구현 전략 제시 |
| **설계**     | architect          | 아키텍처 설계                   |
|              | planner            | 작업 계획 수립                  |
| **공통**     | common-generator   | 타입, 유틸, 상수                |
|              | tester             | 타입체크, 린트, 테스트          |
|              | doc-updater        | 코드 변경 후 용어/참조 동기화   |
|              | doc-compiler       | 인덱스 갱신, 문서 정리          |
|              | git-agent          | 브랜치, 커밋, PR                |
| **Frontend** | fe-page-generator  | Page 레이어                     |
|              | fe-state-generator | State 레이어                    |
|              | fe-model-generator | Model 레이어                    |
|              | fe-repo-generator  | Repo 레이어                     |
| **Backend**  | be-ipc-generator   | IPC 레이어                      |
|              | be-model-generator | Model 레이어                    |
|              | be-repo-generator  | Repo 레이어                     |
| **메타**     | retrospector       | 워크플로우 완료 후 회고 기록    |
|              | system-improver    | 회고 분석, Agent 시스템 개선    |
