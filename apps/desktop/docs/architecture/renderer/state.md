# renderer/state 구조

## 개요

state는 상태 관리 레이어입니다. (React Query + Zustand)

## 구조

```
state/
└── [domain]/
    ├── hook.ts        # Hooks (React Query + Zustand 파생)
    ├── queryKey.ts    # Query keys
    ├── queryOption.ts # Query options
    ├── store.ts       # Zustand store
    └── index.ts       # Barrel file
```

## 규칙

### Import 규칙

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import 가능

#### voyl/restrict-imports-to-pattern

- repo, common, model만 import 가능
