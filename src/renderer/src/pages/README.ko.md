# Pages 구조

_다른 언어로 읽기: [English](README.md)_

## 개요

이 문서는 `pages/` 디렉토리의 구조와 규칙을 설명합니다. 우리는 다음 두 가지 핵심 원칙을 추구합니다:

- **높은 응집도**: 관련된 파일들을 하나의 디렉토리에 모아 관리합니다
- **낮은 결합도**: 명확한 Interface를 통해 컴포넌트 간 의존성을 최소화합니다

## 구조

### 기본 구조

프로젝트는 다음과 같은 계층적 구조를 따릅니다:

```
pages/
├── shared/              # 최상위 공통 컴포넌트
├── products/           # /products 페이지
│   ├── shared/        # products 페이지 공통 컴포넌트
│   ├── list/          # /products/list 페이지
│   │   ├── shared/   # list 페이지 공통 컴포넌트
│   │   └── index.tsx
│   └── [id]/          # /products/:id 페이지
└── index.tsx          # 루트 페이지 (/)
```

### 구성요소

#### 1. shared/

- 공유되는 컴포넌트, 타입, 유틸리티 함수, 상수들이 위치
- 자신과 동일 및 상위 계층에서만 접근 가능하도록 제한
- 페이지/컴포넌트 폴더 내 어디서나 배치 가능

#### 2. 페이지 디렉토리

- URL 구조와 1:1로 매칭되는 디렉토리 구조
- 각 페이지는 자신의 뷰와 로직을 담당하는 `index.tsx` 포함
- 동적 라우팅은 `[parameter]` 형식으로 표현

#### 3. 컴포넌트 구조

각 컴포넌트는 관련 파일들을 하나의 디렉토리에 모아 응집도를 높입니다:

```
ComponentName/
├── shared/         # 컴포넌트 내부 공통 요소
├── index.tsx      # 컴포넌트 구현
├── types.ts       # 타입 정의
├── utils.ts       # 유틸리티 함수
└── const.ts       # 상수 정의
```

## Import 규칙

### voyl/same-hierarchy-import

```typescript
// 동일 계층 내 import
import { ProductList } from './ProductList' // ✅ 동일 계층 컴포넌트
import { types } from './types' // ✅ 같은 디렉토리 내 파일

import { Something } from '../other/Something' // ❌ 다른 계층
import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로

// shared import
import { SharedButton } from '@/pages/shared/Button' // ✅ 상위 계층 shared 파일/폴더
import { ListItem } from './shared/ListItem' // ✅ 동일 계층 shared 파일/폴더

import { Sub } from './shared/Button/Sub' // ❌ shared 하위 경로
import { Other } from '../shared/Other' // ❌ 다른 계층 shared (상위 계층 제외)
import { Button } from './products/shared/Button' // ❌ 하위 계층 shared
```

### voyl/feature-ui-interface-only

```typescript
import { TreeView } from '@/features/tree/ui/TreeView' // ✅ feature ui의 직계 파일
import { FirstPointLink } from '@/features/path/ui/Path' // ✅ feature ui의 직계 폴더

import { FirstPointLink } from '@/features/path/ui/Path/SecondPointLink' // ❌ feature ui의 깊은 중첩 경로
```

### voyl/feature-model-index-import-only

```typescript
import { useTreeStore } from '@/features/tree/model' // ✅ feature model의 단일 진입점

import { useTreeStore } from '@/features/tree/model/node' // ❌ feature model의 깊은 중첩 경로
```
