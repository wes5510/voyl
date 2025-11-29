# renderer/repo 구조

## 개요

repo는 React Query를 사용한 데이터 페칭을 담당합니다.

- Main process와 IPC 통신
- 데이터 페칭 및 캐싱
- Query 및 Mutation 정의

## 구조

```
repo/
└── favorite.ts
```

## Import 규칙

- common만 import 가능
