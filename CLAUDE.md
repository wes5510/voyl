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

1. **정보 수집**: 사용자와 대화하며 요구사항 상세화, analyzer/researcher 호출
2. **전략 수립**: 수집된 정보를 바탕으로 접근 방식 결정
3. **설계 요청**: 복잡한 경우 architect 호출 (선택)
4. **계획 요청**: planner 호출하여 구체적 할일 목록 생성
5. **작업 할당**: planner의 계획을 보고 generator들에게 작업 할당
6. **결과 확인**: Agent 결과에서 `## Needs User Decision` 확인 → 있으면 사용자에게 질문

### 워크플로우 단계

```
1. 정보 수집
   - Whiteboard 초기화 (context.md, agent-notes/)
   - 사용자와 요구사항 상세화
   - analyzer 호출 (code-analyzer 또는 bug-analyzer)
   - researcher 호출 (선택)

2. 전략 수립
   - 오케스트레이터가 접근 방식 결정
   - 사용자 확인 필요시 질문

3. 설계 (복잡한 경우)
   - architect 호출
   - 아키텍처 문서 생성

4. 계획 수립
   - planner 호출
   - 구체적 할일 목록 생성 (어떤 generator가 무엇을 할지)

5. 작업
   - planner 계획에 따라 generator 호출
   - tester로 검증
   - 실패 시 해당 generator 재호출

6. 마무리
   - doc-updater → 문서 동기화
   - doc-compiler → 인덱스 갱신
   - retrospector → 회고 기록
```

### 작업 유형별 참고

| 유형                    | analyzer      | researcher | architect   |
| ----------------------- | ------------- | ---------- | ----------- |
| 새 기능 개발            | code-analyzer | 권장       | 복잡한 경우 |
| 버그 수정               | bug-analyzer  | 권장       | -           |
| 리팩토링                | code-analyzer | 선택       | -           |
| 기능 수정/삭제          | code-analyzer | 선택       | -           |
| 라이브러리 마이그레이션 | code-analyzer | 권장       | -           |
| 문서 작업               | -             | -          | -           |

### Whiteboard

`apps/desktop/docs/whiteboard/{task-dir}/` - 진행 중인 논의, 아이디어, 맥락

- `{task-dir}`: `YYYYMMDDTHHMM-task-name` 형식 (예: `20251130T1530-logger-source-location`)
- 상세 구조: [whiteboard/index.md](apps/desktop/docs/whiteboard/index.md) 참조

### 사용 가능한 Agent

| 분류         | Agent              | 역할                            |
| ------------ | ------------------ | ------------------------------- |
| **분석**     | code-analyzer      | 코드 분석, 의존성 추적          |
|              | bug-analyzer       | 버그 원인 분석                  |
|              | researcher         | 대안 탐색, 베스트 프랙티스 조사 |
| **설계**     | architect          | 아키텍처 설계                   |
|              | planner            | 작업 계획 수립                  |
|              | spec-writer        | 기술 명세 작성                  |
| **공통**     | common-generator   | 타입, 유틸, 상수                |
|              | tester             | 타입체크, 린트, 테스트          |
|              | refactor           | 코드 정리, 패턴 일관성          |
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

### 검증 실패 시

1. 실패 원인 파악 (타입 에러, 린트 에러 등)
2. 해당 generator 재호출로 수정
3. 3회 실패 시 사용자에게 보고
