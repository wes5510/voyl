# 회고: Root Node 덮어쓰기 버그 수정

- **일시**: 2025-12-14
- **워크플로우**: bug-fix
- **결과**: 성공

## 호출된 Agent
- code-researcher: 워크스페이스 관련 흐름 조사, initializeApp vs sync 분석
- bug-analyzer: 근본 원인 도출, sync 후 조건부 생성 전략 수립
- planner: 실행 계획 수립
- be-model-generator: TreeModel.initialize root 생성 제거, TreeModel.sync 추가, AppModel.sync에서 TreeModel.sync 호출
- tester: 타입체크, 린트, 테스트 검증 (모두 통과)

## 잘된 점

### 1. 1차 접근의 실패를 빠르게 인지
- `NodeModel.isExist`가 DB만 체크한다는 점 파악
- 초기화 시점에는 동기화 전이라 DB에 없어서 항상 false 반환
- 조건부 체크가 무의미함을 즉시 확인하고 전략 변경

### 2. 정확한 타이밍 분석
- code-researcher가 initializeApp과 sync의 역할 구분 명확히 함
- initializeApp은 새 워크스페이스 생성 전용
- sync는 기존 워크스페이스 로드 + 동기화 완료 후 처리
- DB vs 파일시스템 상태 차이를 시점별로 정확히 파악

### 3. 책임 분리를 통한 근본 해결
- TreeModel.initialize에서 root 생성 제거 (동기화 전이라 확인 불가)
- TreeModel.sync 추가하여 동기화 후 root 확인/생성
- root node 관리는 TreeModel의 책임으로 명확화
- AppModel은 sync 오케스트레이션만 담당

### 4. 구조적 개선
- TreeModel에 sync 함수가 없었던 문제 해결
- 동기화 후 처리 로직을 위한 확장 포인트 확보
- 기존 NodeModel.isExist 재사용으로 새로운 함수 추가 없음

## 문제점

### 1. 1차 접근에서 타이밍 간과
- `NodeModel.isExist` 체크를 추가했지만 DB 확인이라는 점 놓침
- 초기화 시점에 동기화 전이라는 맥락 파악 실패
- 구현 전에 함수가 어떤 데이터 소스를 보는지 확인 필요

### 2. TreeModel.sync 부재
- TreeModel에 sync 함수가 애초에 없었음
- NodeModel, WorkspaceModel은 있는데 TreeModel만 없어서 확장성 부족
- 동기화 후 처리 로직을 넣을 곳이 없었음

### 3. be-model-generator의 계획 불일치
- planner는 TreeModel.initialize 제거 + AppModel.sync 수정 지시
- be-model-generator는 TreeModel.initialize에 조건부 체크 추가로 구현 (1차)
- 지시사항을 정확히 따르지 않아 재작업 발생

## 개선 아이디어

### 1. 함수 스펙 문서화 강화
- Repo 레이어 함수가 DB를 보는지 파일시스템을 보는지 명시
- 특히 초기화/동기화 시점에 사용되는 함수는 데이터 소스 명확히 기록
- `isExist`, `sync`, `initialize` 등의 동작 타이밍 가이드 작성

### 2. Model 레이어 일관성 확보
- TreeModel에 sync 함수가 없었던 것처럼 누락된 패턴 점검
- NodeModel, WorkspaceModel, TreeModel이 동일한 라이프사이클 함수 제공
- initialize, sync, cleanup 등 공통 인터페이스 정의

### 3. generator Agent 지시 준수 개선
- planner의 계획을 정확히 따르지 않은 문제
- generator가 계획 읽기 → 구현 전 확인 단계 추가 고려
- 또는 planner가 더 구체적인 코드 예시 제공

### 4. 타이밍 이슈 감지 패턴
- 초기화(initialize) vs 동기화(sync) 시점 차이가 버그의 핵심
- 비슷한 타이밍 이슈가 발생할 수 있는 곳 사전 점검
- "DB 확인인가 파일시스템 확인인가" 체크리스트 추가

### 5. 리팩토링 기회 포착
- 버그 수정이 구조 개선으로 이어짐 (TreeModel.sync 추가)
- 단순 수정이 아니라 누락된 패턴 보완 기회로 활용
- 비슷한 누락 패턴이 있는지 점검
