# Context: 초기화시 root 덮어씌우는 버그 수정

## 배경

- 브랜치: `fix/root-overwrite-on-init`
- 초기화 과정에서 root node가 의도치 않게 덮어씌워지는 버그가 발생

## 버그 상세

- **발생 상황**: 앱 최초 실행 시
- **문제**: 선택한 워크스페이스에 이미 root node가 있는데도 새로운 root node를 만들어서 기존 root를 덮어씌움
- **대상**: Root 노드/아이템 (트리 구조의 최상위 노드)

## 1차 분석 결과 (실패한 접근)

`TreeModel.initialize`에서 `NodeModel.isExist` 체크 후 조건부 생성하려 했으나:
- `isExist`는 **DB**를 체크함
- 초기화 시점에 **동기화(sync) 전**이라 DB에 root가 없음
- 파일시스템에 root가 있어도 `isExist`는 항상 false 반환
- 따라서 조건부 체크는 무의미

## 근본 원인

`initializeApp` → `TreeModel.initialize` → `NodeModel.addNode(ROOT_NODE)` 흐름에서:
- 초기화 시점에 무조건 root node 생성
- 동기화 전이라 기존 root 존재 여부를 알 수 없음
- 결과적으로 기존 root를 덮어씀

## 핵심 질문

**왜 초기화 시 root node를 생성하는가?**
- 새 워크스페이스: root 필요 ✓
- 기존 워크스페이스: root 이미 있음, 생성하면 덮어씀 ✗

## 해결 방향

초기화 시 root node 생성 로직 제거 후, 적절한 위치에서 처리:
1. 새 워크스페이스 생성 시에만 root 생성
2. 또는 동기화 후 root 없으면 생성

## 조사 필요 사항

1. 새 워크스페이스 생성 흐름 파악
2. root node가 없을 때의 영향 범위
3. 적절한 root 생성 위치 결정
