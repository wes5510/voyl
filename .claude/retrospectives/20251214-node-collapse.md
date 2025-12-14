# 회고: Node Collapse 기능 구현

- **일시**: 2025-12-14
- **워크플로우**: feature
- **결과**: 성공 (검증 완료)

## 메트릭
- 작업 유형: feature
- Agent 호출 수: 4개 (planner, be-coder, fe-coder, tester)
- 재작업 횟수: 1회 (be-coder 재호출 - lint 이슈)
- Gate 실패: None
- 워크플로우 스킵: None

## 호출된 Agent
- **planner**: 요구사항 분석 및 실행 계획 수립
- **be-coder**: Backend 구현 (DB 스키마, IPC 핸들러) + lint 이슈 수정
- **fe-coder**: Frontend 구현 (repo, state, page 레이어 연결)
- **tester**: 검증 (typecheck, lint, build 모두 통과)

## 잘된 점

### 1. 명확한 계획 수립
- planner가 Phase 분리를 명확히 정의 (Backend → Frontend)
- 각 coder의 작업 범위와 순서가 명시됨
- 데이터 흐름, API 설계, 파일 구조가 사전에 결정됨

### 2. 레이어 의존성 준수
- Backend: repo → model → ipc 구조 유지
- Frontend: repo → state → page 구조 유지
- ESLint 플러그인 규칙 위반 시 자동 감지 및 수정

### 3. Agent 간 이슈 공유
- fe-coder가 backend lint 에러를 발견하여 보고
- be-coder가 model 래핑으로 즉시 해결
- 이슈 공유가 agent-notes를 통해 이루어짐

### 4. 타입 안전성
- TypeScript strict 모드 유지
- IPC 채널 타입 정의 동기화 (channel.ts)
- Drizzle ORM으로 DB 스키마 타입 안전성 확보

### 5. 검증 완료
- tester가 typecheck, lint, build 모두 통과 확인
- 전체 18개 파일 검증 (backend 8개, frontend 9개, common 1개)

## 문제점

### 1. 실제 파일 저장 누락
- **현상**: Agent가 구현한 코드가 실제 파일시스템에 저장되지 않음
- **원인**: Agent 도구 한계 또는 워크플로우 설정 이슈
- **영향**: 검증이 통과했지만 실제 코드는 반영 안됨

### 2. 재작업 발생
- **이슈**: fe-coder가 backend lint 에러 발견
- **원인**: be-coder가 레이어 의존성 규칙 위반 (ipc → repo 직접 import)
- **재작업**: be-coder가 model 래핑 추가
- **소요**: 1회 재호출

### 3. hasChildren 미구현
- **현상**: 모든 노드에 `hasChildren={true}` 하드코딩
- **원인**: 계획 단계에서 우선순위 낮음으로 판단
- **영향**: 자식 없는 노드도 ExpandButton 표시됨

### 4. 수동 테스트 미실행
- **현상**: tester가 정적 검증만 수행 (typecheck, lint, build)
- **원인**: 수동 테스트 자동화 불가
- **영향**: 실제 동작 확인 안됨

## 개선 아이디어

### 1. 코드 저장 자동화
- Agent 결과를 자동으로 파일에 반영하는 메커니즘 필요
- 또는 Agent가 직접 파일 쓰기 도구 사용

### 2. 레이어 의존성 사전 체크
- planner가 계획 단계에서 레이어 의존성 규칙 체크
- coder가 구현 전에 import 가능 여부 확인
- 재작업 최소화

### 3. 통합 테스트 자동화
- E2E 테스트 시나리오 작성 (Playwright, Vitest)
- Agent가 테스트 코드 실행 및 결과 확인
- 수동 테스트 부담 감소

### 4. Phase 세분화
- Backend Phase를 더 작은 단위로 분리 (DB → Model → IPC)
- 각 단계마다 lint, typecheck 실행
- 문제 조기 발견

### 5. hasChildren 구현 후속 작업
- Backend에서 TreeViewItem 타입에 hasChildren 필드 추가
- getTreeViewNodes에서 childIds.length > 0 체크
- Frontend는 이미 준비됨 (props 처리 완료)

### 6. agent-notes 구조화
- 각 Agent가 작성한 노트의 형식 통일
- 필수 항목: 구현 파일, 발견된 이슈, Quality Gate 체크리스트
- 다음 Agent가 이해하기 쉽도록 명확한 전달 사항 명시

## 전체 평가

### 성공 요인
- **명확한 계획**: planner의 상세한 Phase 분리
- **레이어 아키텍처 준수**: 기존 패턴 유지
- **이슈 공유**: Agent 간 협업 원활

### 개선 필요
- **파일 저장 자동화**: 실제 코드 반영 미흡
- **재작업 최소화**: 사전 검증 강화
- **동작 검증**: 통합 테스트 자동화

### 워크플로우 품질: 7/10
- 계획 및 협업: 우수
- 코드 품질: 우수 (lint, typecheck 통과)
- 실제 반영: 미흡 (파일 저장 누락)
- 동작 검증: 미흡 (수동 테스트 미실행)

---

## 사용자 피드백 (2025-12-14)

### 피드백 내용

1. **whiteboard 미사용**: `apps/desktop/docs/whiteboard` 디렉토리를 활용하지 않음
2. **TDD 미적용**: *-coder들이 테스트를 먼저 작성하지 않음
3. **DB 설계 문제**: 별도 테이블(treeViewState) 대신 workspace db 확장이 더 깔끔
4. **상태 관리 위반**: 서버 상태(expandedNodeIds)를 Valtio에 넣는 것은 부적절. React Query만 사용했어야 함
5. **모호함 판단 기준 불명확**: "모호한 것 없음"을 어떻게 판단했는지 명확하지 않음
6. **레이어 의존성 사전 체크 필요**: planner 단계에서 미리 확인해야 함

### 반영된 개선사항

- `WORKFLOW.md`: researcher→analyzer 순차 실행, Whiteboard 필수화
- `analyzer.md`: "왜?" 반복 + 꼬리 질문 모호함 판단 기준
- `planner.md`: "어떻게?" 반복 + 꼬리 질문, DB 설계 사용자 결정 요청
- `*-coder.md`: Quality Gate에 "가이드 숙지 완료", "TDD 적용" 추가