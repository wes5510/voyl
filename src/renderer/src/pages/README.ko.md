# 페이지 디렉토리 구조

_다른 언어로 읽기: [English](README.md)_

이 문서는 `pages/` 디렉토리의 구조와 규칙을 설명합니다.

## 디렉토리 구조 예시

```
pages/
├── shared/                 # 모든 위계에서 사용 가능한 요소
│   ├── Button/
│   │   ├── index.tsx       # 버튼 컴포넌트
│   │   ├── types.ts        # 타입 정의
│   │   ├── utils.ts        # 유틸리티 함수
│   │   └── const.ts        # 상수 정의
│   ├── Input/
│   │   ├── index.tsx
│   │   └── types.ts
│   └── Header/
│       ├── index.tsx
│       └── const.ts
├── products/               # 상품 관련 페이지
│   ├── ProductList/        # 상품 목록 컴포넌트
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── ProductDetail/      # 상품 상세 컴포넌트
│   │   ├── index.tsx
│   │   └── const.ts
│   ├── [id]/               # 동적 라우팅 (Dynamic routing)
│   │   ├── Detail/         # 특정 ID 페이지 전용 컴포넌트
│   │   │   └── index.tsx
│   │   └── index.tsx       # /products/:id 페이지
│   └── index.tsx           # /products 페이지
└── index.tsx               # 루트 페이지
```

## 핵심 규칙

### 1. 계층적 구조
- 컴포넌트는 계층적 구조로 폴더를 구성
- 연관된 파일들(컴포넌트, 타입, 유틸리티 등)은 같은 폴더에 위치
- 모든 폴더의 진입점은 `index.tsx`로 통일

### 2. Import 제한
- 동일 위계의 파일끼리만 import 가능
- `shared/`의 직접 하위 파일은 예외적으로 동일 위계 + 하위 위계에서 import 가능

#### Import 예시
```typescript
// File: pages/products/ProductList/index.tsx
// 1. 동일 위계 import
import SubList from './SubList'                         // ✅ 같은 디렉토리 내 컴포넌트
import { ProductListType } from './types'               // ✅ 같은 디렉토리 내 타입
import { formatProduct } from './utils'                 // ✅ 같은 디렉토리 내 유틸리티
import { PRODUCT_STATUS } from './const'                // ✅ 같은 디렉토리 내 상수

// 2. shared import (예외적으로 동일 위계 + 하위 위계에서 import 가능)
import { Button } from '@/pages/shared/Button.tsx'      // ✅ shared의 직접 하위 파일 import 가능
```

#### 금지되는 Import
```typescript
// File: pages/products/ProductList/index.tsx
// 1. 다른 위계의 컴포넌트 참조
import { OrderList } from '@/pages/orders/OrderList'          // ❌ 다른 위계의 컴포넌트
import { ProductDetail } from '../ProductDetail'              // ❌ 상위 위계의 컴포넌트

// 2. shared 디렉토리 참조
// File: pages/products/ProductList/index.tsx
import { SubButton } from '@/pages/shared/Button/SubButton'   // ❌ shared 하위 디렉토리는 import 불가
import { SubButton } from './SubButton/shared/Button'         // ❌ 하위 위계의 shared 디렉토리는 import 불가
```

## ESLint 규칙

프로젝트는 이 구조를 강제하기 위한 ESLint 규칙을 포함합니다:

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // import 경로 규칙 검사
    "voyl/component-structure": "error"    // 컴포넌트 구조 규칙 검사
  }
}
```
