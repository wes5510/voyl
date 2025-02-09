# Features 구조

_다른 언어로 읽기: [English](README.md)_

## 개요

features는 도메인 기능을 구현하는 곳입니다.
각 feature는 독립적인 도메인 단위로 구성되어 있습니다.

## 구조

### 기본 구조

```
features/
└── [feature]/
    ├── model/           # 도메인 로직
    │   ├── index.ts     # 외부로 노출되는 인터페이스
    │   ├── store.ts     # 상태 관리
    │   └── types.ts     # 타입 정의
    └── ui/              # UI 컴포넌트
        ├── index.tsx    # 주요 컴포넌트
        └── Button/      # 내부 컴포넌트
```

### 구성요소

#### 1. model/

- 도메인 모델의 데이터 구조와 비즈니스 로직이 위치
- `index.ts`는 store를 통한 상태 관리 및 액션 노출
- 도메인 로직은 순수 함수로 구현

#### 2. ui/

- 도메인 모델을 사용하여 구성된 UI 컴포넌트들이 위치
- 도메인 모델의 시각화와 사용자 상호작용 처리
- UI 관련 로직 관리

## Import 규칙

### features

#### voyl/feature-model-index-import-only

```typescript
// @/features/tree/ui/TreeView.tsx
import useTreeStore from '@/features/tree/model' // ✅ 같은 feature 파일

import usePathStore from '@/features/path/model' // ❌ 다른 feature 파일
```

#### voyl/no-pages-import

```typescript
import { TreeView } from '@/pages/tree/ui' // ❌ pages 레이어 파일
```

### model/

#### voyl/same-hierarchy-import

```typescript
// 동일 계층 내 import
import { ProductList } from './ProductList' // ✅ 동일 계층 컴포넌트
import { types } from './types' // ✅ 같은 디렉토리 내 파일

import { Something } from '../other/Something' // ❌ 다른 계층
import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로
```

### ui/

#### voyl/same-hierarchy-import

```typescript
// 동일 계층 내 import
import { ProductList } from './ProductList' // ✅ 동일 계층 컴포넌트
import { types } from './types' // ✅ 같은 디렉토리 내 파일

import { Something } from '../other/Something' // ❌ 다른 계층
import { Deep } from './deep/nested/Component' // ❌ 깊은 중첩 경로

// shared import
import { SharedButton } from '@/features/tree/ui/shared/Button' // ✅ 상위 계층 shared 파일/폴더
import { ListItem } from './shared/ListItem' // ✅ 동일 계층 shared 파일/폴더

import { Sub } from './shared/Button/Sub' // ❌ shared 하위 경로
import { Other } from '../shared/Other' // ❌ 다른 계층 shared (상위 계층 제외)
import { Button } from './products/shared/Button' // ❌ 하위 계층 shared
```

#### voyl/feature-model-index-import-only

```typescript
import { useTreeStore } from '@/features/tree/model' // ✅ feature model의 단일 진입점

import { useTreeStore } from '@/features/tree/model/node' // ❌ feature model의 깊은 중첩 경로
```
