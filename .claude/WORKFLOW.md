# WORKFLOW.md

이 파일은 Agent 시스템의 워크플로우를 정의합니다.

## 개요

4단계 워크플로우: **Explore → Plan → Code → Commit**

| 단계 | 역할 | 질문 |
|------|------|------|
| Explore | 현황 파악 + What 구체화 | "문제가 뭐고, 뭘 해야 하나?" |
| Plan | How 계획 | "어떻게 구현하나?" |
| Code | 구현 + 검증 | |
| Commit | 문서화 + 커밋 + 회고 | |

```
Explore: researcher → analyzer → [Explore Gate]
Plan:    planner → [Plan Gate]
Code:    coders (병렬) → tester → [Code Gate]
Commit:  doc-writer, git-agent, retrospector
```

## 1. Explore

### 흐름

1. [오케스트레이터] Whiteboard 초기화 (context.md 생성)
2. [Task] researcher 호출
3. [Task] analyzer 호출
4. [Explore Gate]

### Explore Gate

통과 조건:
- [ ] 문제/요구사항 명확히 정의됨 (What)
- [ ] Needs More Research 없음
- [ ] Needs User Decision 해결됨

실패 시:
- Needs More Research → researcher 재호출
- Needs User Decision → 오케스트레이터가 사용자에게 질문

## 2. Plan

### 흐름

1. [Task] planner 호출
2. [Plan Gate]

### Plan Gate

통과 조건:
- [ ] 영향 범위 식별 완료
- [ ] 실행 순서 명확 (How)
- [ ] 담당 coder 지정됨
- [ ] 모호한 부분 0개

실패 시:
- Needs More Research → Explore로 복귀
- Needs User Decision → 오케스트레이터가 사용자에게 질문

## 3. Code

### 흐름

1. [Task] planner 계획에 따라 coders 호출 (의존성 없으면 병렬)
2. [Task] tester로 검증
3. [Code Gate]

### Code Gate

통과 조건:
- [ ] typecheck 통과
- [ ] lint 에러 0개
- [ ] 기존 테스트 100% 통과
- [ ] 빌드 성공

실패 시:
- 해당 coder 재호출 (최대 3회)

## 4. Commit

### 흐름

1. [Task] doc-writer 호출
2. [Task] git-agent 호출
3. [Task] retrospector 호출 (doc-writer와 병렬 가능)

## 오케스트레이터 책임

| 상황 | 행동 |
|------|------|
| Needs More Research | 해당 단계 재실행 |
| Needs User Decision | 사용자에게 질문 → 답변 전달 |
| Gate 실패 | 실패 사유에 따라 재호출 또는 복귀 |
| Gate 통과 | 다음 단계로 진행 |

### 필수 규칙

1. **Whiteboard 초기화**: researcher 호출 전에 context.md 생성
2. **planner 필수**: Code 단계 진입 전 반드시 planner 호출
3. **병렬 실행 우선**: 의존성 없는 coder들은 동시 호출
4. **마무리 자동 실행**: Code Gate 통과 후 자동으로 Commit 단계

## 사용 가능한 Agent

> 상세 정의는 `.claude/agents/` 참조

| 단계 | Agent | 역할 |
|------|-------|------|
| Explore | researcher | 정보 수집 (코드, 웹, 문서, git, 런타임) |
| Explore | analyzer | What 정의, 전략 제시 |
| Plan | planner | How 계획, 실행 순서 |
| Code | common-coder | 타입, 유틸, 상수 |
| Code | fe-coder | Frontend 전체 (page, state, model, repo) |
| Code | be-coder | Backend 전체 (ipc, model, repo) |
| Code | tester | 타입체크, 린트, 테스트, 빌드 |
| Commit | doc-writer | 문서 동기화 + 인덱스 갱신 |
| Commit | git-agent | 브랜치, 커밋, PR |
| Commit | retrospector | 워크플로우 회고 |
| Meta | system-improver | 회고 분석, Agent 개선 |

## Whiteboard

`apps/desktop/docs/whiteboard/{task-dir}/`

- `{task-dir}`: `YYYYMMDDTHHMM-task-name` 형식 (예: `20251130T1530-logger-source-location`)
- `context.md`: 요구사항, 제약
- `decisions.md`: 설계 결정 + 근거 (ADR)
- `agent-notes/`: Agent별 분석 결과

상세 구조: [whiteboard/index.md](../apps/desktop/docs/whiteboard/index.md) 참조
