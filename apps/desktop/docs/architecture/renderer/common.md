# renderer/common 구조

## 개요

common 모듈은 프로젝트 전반에서 재사용되는 도메인 독립적인 순수 공통 코드를 관리합니다.
높은 재사용성과 독립성을 위해 외부 의존성을 최소화합니다.

## 구조

```
common/
├── Tooltip/        # UI 컴포넌트 (폴더)
│   └── index.tsx
├── shared/         # 공유 유틸리티
│   └── cn.ts
└── Button.tsx      # UI 컴포넌트 (단일 파일)
```

### 구성요소

- UI 컴포넌트, React hooks, 유틸리티 함수, 상수, 타입 정의 등이 포함
- 특정 도메인에 종속되지 않는 순수한 공통 코드
- 컴포넌트는 단일 파일(.tsx) 또는 폴더(index.tsx)로 구성 가능

## 규칙

### Import 규칙

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import 가능
- shared 폴더는 상위/동일 계층에서 import 가능

#### voyl/restrict-imports-to-pattern

- 다른 모듈(model, page 등)의 코드를 import할 수 없음
