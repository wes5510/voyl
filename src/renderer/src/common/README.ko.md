# Common 구조

_다른 언어로 읽기: [English](README.md)_

## 개요

common은 프로젝트 전반에서 재사용되는 순수한 공통 코드를 관리합니다.
높은 재사용성과 독립성을 위해 외부 의존성을 최소화합니다.

## 구조

### 기본 구조

```
common/
├── Button/         # UI 컴포넌트
│   └── index.tsx
├── useTable.ts     # React hooks
├── date.util.ts    # 유틸리티 함수
├── date.const.ts   # 상수
└── table.type.ts   # 타입 정의
```

### 구성요소

- UI 컴포넌트, React hooks, 유틸리티 함수, 상수, 타입 정의 등이 포함
- 특정 도메인에 종속되지 않는 순수한 공통 코드
- 모든 파일은 루트 레벨에 위치 (Flatten 구조)
- 컴포넌트는 단일 파일(.tsx) 또는 폴더(index.tsx)로 구성 가능

## 규칙

### Import 규칙

#### 허용되는 Import

```typescript
// 1. 동일 디렉토리 내 Import
import { Button } from './Button' // ✅ 같은 디렉토리 내 폴더(index.ts/tsx)
import { types } from './types' // ✅ 같은 디렉토리 내 파일

// 2. shared 디렉토리 Import
import { SharedButton } from '@/common/shared/Button' // ✅ 상위 위계 shared 파일/폴더
import { ListItem } from './shared/ListItem' // ✅ 동일 위계 shared 파일/폴더
```

#### 금지되는 Import

```typescript
// 1. 다른 위계 Import
import { Something } from '../other/Something' // ❌ 다른 위계
import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로

// 2. shared 제한
import { Sub } from './shared/Button/Sub' // ❌ shared 하위 경로
import { Other } from '../shared/Other' // ❌ 다른 위계 shared (상위 위계 제외)
import { Button } from './utils/shared/Button' // ❌ 하위 위계 shared
```

## ESLint 규칙

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // 허용된 import 경로만 사용
  }
}
```
