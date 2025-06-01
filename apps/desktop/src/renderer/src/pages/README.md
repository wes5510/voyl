# Pages 구조

_다른 언어로 읽기: [English](README.md)_

## 개요

Pages 레이어는 애플리케이션의 UI 컴포넌트와 사용자 인터페이스를 구성합니다.
URL 구조와 1:1로 매칭되는 디렉토리 구조를 통해 직관적인 페이지 구성을 제공합니다.

## 구조

### 기본 구조

```
pages/
├── shared/              # 최상위 공통 컴포넌트
├── products/            # /products 페이지
│   ├── shared/          # products 페이지 공통 컴포넌트
│   ├── list/            # /products/list 페이지
│   │   ├── shared/      # list 페이지 공통 컴포넌트
│   │   └── index.tsx
│   └── [id]/            # /products/:id 페이지
└── index.tsx            # 루트 페이지 (/)
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

## 규칙

### Import 규칙

#### voyl/same-hierarchy-import

- 동일 계층 내의 파일만 import할 수 있습니다.

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

#### voyl/restrict-imports-to-pattern

- model 모듈에서는 store만 import할 수 있습니다.

  ```typescript
  import useTreeViewStore from '@/models/treeView/store' // ✅ model의 store

  import { useTreeStore } from '@/models/treeView/draggingNode' // ❌ model의 깊은 중첩 경로
  ```

## 관련 문서

아래 문서에서 다른 모듈에 대한 상세 정보를 확인할 수 있습니다:

- [프로젝트 구조](../README.ko.md)
- [Models 구조](../models/README.ko.md)
- [Common 구조](../common/README.ko.md)
