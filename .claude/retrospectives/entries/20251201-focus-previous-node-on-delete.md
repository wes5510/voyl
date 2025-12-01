# 회고: Node 삭제시 이전 노드로 포커스 이동

- **일시**: 2025-12-01
- **워크플로우**: new-feature
- **결과**: 성공
- **PR**: https://github.com/wes5510/voyl/pull/33

## 호출된 Agent

1. **code-analyzer**: 노드 삭제 플로우 및 포커스 관리 메커니즘 분석
2. **planner**: (오케스트레이터가 직접 계획 수립)
3. **be-model-generator**: `getPreviousFocusableNodeId` 함수 구현
4. **be-ipc-generator**: `node.getPreviousFocusableNodeId` IPC 핸들러 추가
5. **fe-repo-generator**: Repo 레이어 함수 추가
6. **fe-state-generator**: State 레이어 re-export
7. **fe-page-generator**: Page 레이어에서 삭제 전 호출 및 포커스 이동 로직 추가
8. **tester**: 타입체크, 린트, 테스트, 빌드 검증
9. **git-agent**: 커밋, 푸시, PR 생성

## 잘된 점

### 1. 명확한 설계 의사결정
- code-analyzer가 2가지 옵션을 제시했고, 사용자가 명확히 결정함
- "삭제 전 별도 API 호출" 방식 선택으로 인지하기 쉬운 구조 확립
- 설계 의도가 agent-notes에 명시적으로 기록됨

### 2. 레이어 아키텍처 준수
- Backend Model → IPC → Frontend Repo → State → Page 순서로 단계적 구현
- 각 레이어 책임이 명확히 분리됨:
  - Backend Model: 비즈니스 로직 (이전 노드 ID 계산)
  - IPC: 프로세스 간 통신
  - Frontend Repo: IPC 래핑
  - State: re-export (React Query 불필요하다고 판단)
  - Page: UI 이벤트 처리 및 포커스 이동

### 3. 효율적인 Agent 호출 순서
- 의존성 방향에 따라 Backend → Frontend 순서로 진행
- 각 Agent가 다음 Agent의 작업 내용을 agent-notes에 명시
- 재작업 없이 한 번에 완료

### 4. 일관된 패턴 활용
- fe-state-generator가 기존 `updateNodeTitle` 패턴 발견
- Query Hook 대신 직접 re-export 방식 채택
- 설계 근거를 agent-notes에 명확히 기록

### 5. 철저한 검증
- tester가 타입체크, 린트, 테스트(46개), 빌드 모두 검증
- 변경 파일 목록 명시

## 문제점

### 1. planner Agent 미호출
- 오케스트레이터가 직접 계획 수립
- planner를 거쳤다면 더 구조화된 계획이 가능했을 수 있음
- 다만 이번 작업은 단순하여 큰 문제는 없었음

### 2. context.md 부재
- Whiteboard에 context.md가 생성되지 않음
- 작업 배경, 목표, 제약사항 등이 구조화되지 않음
- agent-notes만으로도 진행 가능했지만, 컨텍스트 일관성 측면에서 아쉬움

### 3. 수동 테스트 과정 미기록
- 실제 UI에서 동작 확인했는지 agent-notes에 기록 없음
- tester는 자동화 검증만 수행
- 사용자가 수동 테스트했을 가능성이 높으나 기록 부재

## 개선 아이디어

### 1. planner 필수 호출 규칙
- 워크플로우 단계에서 planner를 선택이 아닌 필수로 지정
- 단순한 작업이어도 planner가 계획 수립하면:
  - 오케스트레이터 부담 감소
  - 계획의 일관성 확보
  - agent-notes와 별도로 구조화된 계획 문서 생성

### 2. Whiteboard 초기화 강화
- code-analyzer 호출 시 context.md 자동 생성
- 템플릿:
  ```markdown
  # Context: {작업명}

  ## 작업 배경
  {사용자 요청 배경}

  ## 목표
  {달성하려는 목표}

  ## 제약사항
  {아키텍처 규칙, 레이어 의존성 등}

  ## 의사결정
  {설계 선택 근거}
  ```

### 3. tester Agent 확장
- 자동화 검증 외에 "수동 테스트 가이드" 출력
- 예:
  ```markdown
  ## 수동 테스트 필요 항목
  1. 중간 노드 삭제 → 이전 형제로 포커스 이동 확인
  2. 첫 번째 자식 노드 삭제 → 부모로 포커스 이동 확인
  3. 마지막 자식 노드 삭제 → 이전 형제로 포커스 이동 확인
  ```

### 4. fe-page-generator 자동 테스트 시나리오 제안
- Page 레이어 변경 시 E2E 테스트 스켈레톤 생성 제안
- 현재는 수동 테스트에 의존

## 메트릭

- **호출된 Agent 수**: 9개
- **변경 파일 수**: 6개
- **재작업 횟수**: 0회
- **전체 소요 시간**: 약 30분 (추정)
- **검증 결과**: 46개 테스트 모두 통과

## 특이사항

- 사용자가 설계 옵션(별도 API vs 응답 포함)에서 명확한 선호를 표현
- "인지하기 어렵다"는 UX 관점의 피드백이 설계에 반영됨
- Agent들이 서로의 작업을 참고하며 일관된 패턴 유지
