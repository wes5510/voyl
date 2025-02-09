# Common 구조

_다른 언어로 읽기: [English](README.md)_

## 개요

common은 프로젝트 전반에서 재사용되는 도메인 독립적인 순수 공통 코드를 관리합니다.
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

## Import 규칙

### voyl/same-hierarchy-import

```typescript
// 동일 계층 내 import
import { ProductList } from './ProductList' // ✅ 동일 계층 컴포넌트
import { types } from './types' // ✅ 같은 디렉토리 내 파일

import { Something } from '../other/Something' // ❌ 다른 계층
import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로

// shared import
import { SharedButton } from '@/common/shared/Button' // ✅ 상위 계층 shared 파일/폴더
import { ListItem } from './shared/ListItem' // ✅ 동일 계층 shared 파일/폴더

import { Sub } from './shared/Button/Sub' // ❌ shared 하위 경로
import { Other } from '../shared/Other' // ❌ 다른 계층 shared (상위 계층 제외)
import { Button } from './products/shared/Button' // ❌ 하위 계층 shared
```

### voyl/common-isolation

```typescript
import * as React from 'react' // ✅ node_modules 모듈

import { TreeView } from '@/features/tree/ui/TreeView' // ❌ 다른 레이어 모듈
```
