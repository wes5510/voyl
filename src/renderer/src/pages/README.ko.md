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
- 자신과 동일 및 상위 위계에서만 접근 가능하도록 제한
- 페이지나 컴포넌트 폴더 어디에나 위치 가능

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

#### 허용되는 Import

```typescript
// 1. 동일 디렉토리 내 Import
import SubList from './SubList' // ✅ 같은 디렉토리 내 컴포넌트
import { ProductListType } from './types' // ✅ 같은 디렉토리 내 타입

// 2. shared 디렉토리 Import
import Button from '@/pages/shared/Button' // ✅ 상위 shared
import ListItem from './shared/ListItem' // ✅ 동일 위계 shared
```

#### 금지되는 Import

```typescript
// 1. 다른 위계의 컴포넌트 Import
import OrderList from '@/pages/orders/OrderList' // ❌ 다른 위계
import ProductDetail from '../ProductDetail' // ❌ 상위 위계

// 2. shared 디렉토리 Import 제한
import SubButton from '@/pages/shared/Button/SubButton' // ❌ shared 하위 디렉토리
import ProductCard from '@/pages/orders/shared/ProductCard' // ❌ 다른 위계의 shared
import Button from './products/shared/Button' // ❌ 하위 위계의 shared
```

## ESLint 규칙

```javascript
{
  "rules": {
    "voyl/import-path-format": "error",    // 허용된 import 경로만 사용
  }
}
```
