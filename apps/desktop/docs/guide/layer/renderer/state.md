# renderer/state 구조

## 개요

state는 상태 관리 레이어입니다. (React Query + Valtio)

## 구조

```
state/
└── {domain}/
    ├── store.ts         # Valtio proxy + actions (UI 상태가 있을 때만)
    ├── hook.ts          # Hooks (React Query + Valtio useSnapshot)
    ├── queryOption.ts   # Query options
    ├── queryKey.ts      # Query keys
    └── index.ts         # Barrel file
```

## 파일 생성 기준

| 파일 | 생성 조건 |
|------|-----------|
| `store.ts` | 클라이언트 전용 UI 상태가 필요할 때 |
| `hook.ts` | 항상 |
| `queryOption.ts` | 서버 데이터 fetch가 있을 때 |
| `queryKey.ts` | React Query 사용할 때 |

## 상태 유형별 사용 기술

| 상태 유형 | 기술 | 예시 |
|-----------|------|------|
| 서버 데이터 | React Query | node 데이터, tree 구조 |
| UI 상태 | Valtio (store.ts) | focusedNodeId, topNodeId, dragging |

## 네이밍 규칙

- 파일명: 모두 단수형 (hook.ts, queryKey.ts 등)
- store.ts: Valtio proxy 선언 + actions 함수 통합

## Import 규칙

- repo, common, model만 import 가능
