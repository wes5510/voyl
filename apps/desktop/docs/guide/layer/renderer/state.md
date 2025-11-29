# renderer/state 구조

## 개요

state는 상태 관리 레이어입니다. (React Query + Valtio)

## 구조

```
state/
└── [domain]/
    ├── state.ts       # Valtio proxy state
    ├── actions.ts     # State 변경 함수
    ├── hooks.ts       # Hooks (React Query + Valtio useSnapshot)
    ├── queryKeys.ts   # Query keys
    ├── queryOptions.ts # Query options
    └── index.ts       # Barrel file
```

## Import 규칙

- repo, common, model만 import 가능
